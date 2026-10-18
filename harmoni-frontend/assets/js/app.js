/**
 * app.js
 * Tầng gọi API dùng chung (giống "service layer") + khởi tạo khung giao diện (shell).
 * Toàn bộ trang khác chỉ gọi qua đối tượng HarmoniStore / HarmoniApp, không tự gọi fetch().
 *
 * HarmoniStore giờ gọi thật sang BE qua REST API (JSON). Đổi API_BASE bên dưới cho khớp
 * với địa chỉ server BE của bạn. Mọi hàm đọc/ghi dữ liệu đều là async (trả về Promise),
 * nên nơi gọi phải dùng await / .then().
 */

(function (global) {
  "use strict";

  var API_BASE = global.HARMONI_API_BASE || "http://localhost:3000/api";

  var TOKEN_KEY = "harmoni_token_v1";
  var USER_KEY = "harmoni_user_v1";

  // ---------------------------------------------------------------------
  // GỌI API DÙNG CHUNG
  // ---------------------------------------------------------------------

  function authHeaders() {
    var headers = { "Content-Type": "application/json" };
    var token = sessionStorage.getItem(TOKEN_KEY);
    if (token) headers["Authorization"] = "Bearer " + token;
    return headers;
  }

  async function apiRequest(method, path, body) {
    var res = await fetch(API_BASE + path, {
      method: method,
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (res.status === 204) return null;

    var data = null;
    try { data = await res.json(); } catch (e) { /* không có body JSON */ }

    if (!res.ok) {
      var err = new Error((data && data.error) || ("Lỗi " + res.status));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  var api = {
    get: function (path) { return apiRequest("GET", path); },
    post: function (path, body) { return apiRequest("POST", path, body); },
    put: function (path, body) { return apiRequest("PUT", path, body); },
    del: function (path) { return apiRequest("DELETE", path); }
  };

  // ---------------------------------------------------------------------
  // PHIÊN ĐĂNG NHẬP (sessionStorage): lưu token + thông tin user sau khi login
  // ---------------------------------------------------------------------

  function getCurrentUser() {
    var raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function getCurrentUserId() {
    var u = getCurrentUser();
    return u ? u.id : null;
  }

  function setSession(token, user) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  function isLoggedIn() {
    return !!sessionStorage.getItem(TOKEN_KEY);
  }

  // ---------------------------------------------------------------------
  // AUTH
  // ---------------------------------------------------------------------

  async function login(email, password) {
    var data = await api.post("/auth/login", { email: email, password: password });
    setSession(data.token, data.user);
    return data.user;
  }

  async function registerUser(email, password) {
    return api.post("/auth/register", { email: email, password: password });
  }

  async function logout() {
    try { await api.post("/auth/logout"); } catch (e) { /* ignore */ }
    clearSession();
  }

  // ---------------------------------------------------------------------
  // INTERESTS (cache lại vì đây là danh mục tĩnh, hiếm khi đổi)
  // ---------------------------------------------------------------------

  var _interestsCache = null;

  async function loadInterests() {
    if (_interestsCache) return _interestsCache;
    _interestsCache = await api.get("/interests");
    return _interestsCache;
  }

  function getAllInterests() {
    return (_interestsCache || []).slice();
  }

  function getInterestById(id) {
    return (_interestsCache || []).filter(function (i) { return i.id === id; })[0] || null;
  }

  function getInterestsByIds(ids) {
    return (ids || []).map(getInterestById).filter(Boolean);
  }

  // ---------------------------------------------------------------------
  // PROFILES
  // ---------------------------------------------------------------------

  async function getProfile(userId) {
    try {
      return await api.get("/profiles/" + userId);
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  async function hasProfile(userId) {
    var p = await getProfile(userId);
    return p !== null;
  }

  async function upsertProfile(profileData) {
    return api.put("/profiles/me", profileData);
  }

  function calcAge(dobStr) {
    var dob = new Date(dobStr);
    var now = new Date();
    var age = now.getFullYear() - dob.getFullYear();
    var hasHadBirthdayThisYear =
      now.getMonth() > dob.getMonth() ||
      (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
  }

  function isAdultDob(dobStr) {
    if (!dobStr) return false;
    var dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return false;
    if (dob.getTime() > Date.now()) return false;
    return calcAge(dobStr) >= 18;
  }

  // ---------------------------------------------------------------------
  // DISCOVER / LIKES
  // ---------------------------------------------------------------------

  async function getDiscoverDeck() {
    // BE trả về sẵn [{ profile, similarity, commonInterestIds }], đã loại bản thân/đã swipe/bị chặn
    return api.get("/discover");
  }

  /** Dùng cho user-detail.html: lấy 1 hồ sơ kèm % tương đồng, sở thích chung, trạng thái đã Like/Pass/bị chặn chưa */
  async function getDiscoverDetail(targetUserId) {
    try {
      return await api.get("/discover/" + targetUserId);
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  /** Ghi lại hành động Like/Pass. Trả về { action, matched, matchId } */
  async function recordSwipe(targetUserId, action) {
    return api.post("/likes", { toUserId: targetUserId, action: action });
  }

  // ---------------------------------------------------------------------
  // MATCHES
  // ---------------------------------------------------------------------

  async function getMatchesForUser() {
    // BE trả về [{ matchId, matchedAt, otherUserId, otherProfile, similarity, lastMessage }]
    return api.get("/matches");
  }

  async function unmatch(matchId) {
    return api.del("/matches/" + matchId);
  }

  // ---------------------------------------------------------------------
  // MESSAGES
  // ---------------------------------------------------------------------

  async function getMessages(matchId) {
    return api.get("/matches/" + matchId + "/messages");
  }

  async function addMessage(matchId, text) {
    return api.post("/matches/" + matchId + "/messages", { text: text });
  }

  // ---------------------------------------------------------------------
  // BLOCKS / REPORTS
  // ---------------------------------------------------------------------

  async function getBlockedUsers() {
    return api.get("/blocks");
  }

  async function blockUser(blockedId) {
    return api.post("/blocks", { blockedId: blockedId });
  }

  async function unblockUser(blockedId) {
    return api.del("/blocks/" + blockedId);
  }

  async function addReport(reportedId, reason, description) {
    return api.post("/reports", { reportedId: reportedId, reason: reason, description: description || "" });
  }

  // ---------------------------------------------------------------------
  // EXPORT STORE
  // ---------------------------------------------------------------------

  global.HarmoniStore = {
    getCurrentUser: getCurrentUser,
    getCurrentUserId: getCurrentUserId,
    clearSession: clearSession,
    isLoggedIn: isLoggedIn,

    login: login,
    registerUser: registerUser,
    logout: logout,

    loadInterests: loadInterests,
    getAllInterests: getAllInterests,
    getInterestById: getInterestById,
    getInterestsByIds: getInterestsByIds,

    getProfile: getProfile,
    hasProfile: hasProfile,
    upsertProfile: upsertProfile,
    calcAge: calcAge,
    isAdultDob: isAdultDob,

    getDiscoverDeck: getDiscoverDeck,
    getDiscoverDetail: getDiscoverDetail,
    recordSwipe: recordSwipe,

    getMatchesForUser: getMatchesForUser,
    unmatch: unmatch,

    getMessages: getMessages,
    addMessage: addMessage,

    getBlockedUsers: getBlockedUsers,
    blockUser: blockUser,
    unblockUser: unblockUser,
    addReport: addReport
  };

  // ---------------------------------------------------------------------
  // HarmoniApp: khởi tạo khung giao diện dùng chung (sidebar/topbar/toast/modal)
  // ---------------------------------------------------------------------

  var PURPOSE_LABELS = { friend: "Kết bạn", dating: "Hẹn hò", longterm: "Tìm mối quan hệ lâu dài" };
  var GENDER_LABELS = { male: "Nam", female: "Nữ", other: "Khác" };
  var DEFAULT_AVATAR = "assets/images/default-avatar.svg";

  function purposeLabel(key) { return PURPOSE_LABELS[key] || key; }
  function genderLabel(key) { return GENDER_LABELS[key] || key; }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Bắt buộc đăng nhập mới được xem trang. Gọi ở đầu mỗi trang yêu cầu đăng nhập. */
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  /** Bắt buộc đã có hồ sơ (dùng cho các trang cần hồ sơ hoàn chỉnh như Khám phá, Hồ sơ...). Async vì phải hỏi BE. */
  async function requireProfile() {
    var uid = getCurrentUserId();
    var ok = await hasProfile(uid);
    if (!ok) {
      window.location.href = "create-profile.html";
      return false;
    }
    return true;
  }

  /** Gắn thông tin người dùng hiện tại + active nav + logout cho khung sidebar/topbar đã có sẵn trong HTML */
  async function initAppShell(activeKey) {
    var uid = getCurrentUserId();
    var profile = uid ? await getProfile(uid) : null;
    var displayName = profile ? profile.displayName : "Người dùng";

    document.querySelectorAll("[data-current-user-name]").forEach(function (el) {
      el.textContent = displayName;
    });
    document.querySelectorAll("[data-current-user-avatar]").forEach(function (el) {
      el.setAttribute("src", (profile && profile.avatar) || DEFAULT_AVATAR);
    });

    document.querySelectorAll("[data-nav]").forEach(function (el) {
      if (el.getAttribute("data-nav") === activeKey) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    document.querySelectorAll('[data-action="logout"]').forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        logout().then(function () { window.location.href = "index.html"; });
      });
    });

    document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(function (el) {
      el.addEventListener("click", function () {
        document.body.classList.toggle("sidebar-open");
      });
    });
    var overlay = document.querySelector("[data-sidebar-overlay]");
    if (overlay) {
      overlay.addEventListener("click", function () {
        document.body.classList.remove("sidebar-open");
      });
    }
  }

  /** Toast thông báo (thành công / lỗi / thông tin) dùng Bootstrap Toast, tự tạo DOM nếu chưa có container */
  function showToast(message, type) {
    type = type || "success";
    var container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      container.style.zIndex = 1080;
      document.body.appendChild(container);
    }
    var iconMap = { success: "bi-check-circle-fill", danger: "bi-exclamation-circle-fill", info: "bi-info-circle-fill" };
    var toastEl = document.createElement("div");
    toastEl.className = "toast align-items-center text-bg-" + type + " border-0";
    toastEl.setAttribute("role", "alert");
    toastEl.innerHTML =
      '<div class="d-flex">' +
        '<div class="toast-body"><i class="bi ' + (iconMap[type] || iconMap.info) + ' me-2"></i>' + escapeHtml(message) + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
      '</div>';
    container.appendChild(toastEl);
    var bsToast = new bootstrap.Toast(toastEl, { delay: 3200 });
    bsToast.show();
    toastEl.addEventListener("hidden.bs.toast", function () { toastEl.remove(); });
  }

  /** Hiện toast lỗi gọn từ exception của apiRequest (hoặc lỗi mạng) */
  function showApiError(err, fallbackMessage) {
    console.error(err);
    showToast((err && err.message) || fallbackMessage || "Có lỗi xảy ra, vui lòng thử lại.", "danger");
  }

  function formatMessageTime(iso) {
    var d = new Date(iso);
    var now = new Date();
    var sameDay = d.toDateString() === now.toDateString();
    var hh = String(d.getHours()).padStart(2, "0");
    var mm = String(d.getMinutes()).padStart(2, "0");
    if (sameDay) return hh + ":" + mm;
    var dd = String(d.getDate()).padStart(2, "0");
    var mo = String(d.getMonth() + 1).padStart(2, "0");
    return dd + "/" + mo + " " + hh + ":" + mm;
  }

  /** Gắn nút hiện/ẩn mật khẩu: <button data-toggle-password="idCuaInput"><i class="bi bi-eye"></i></button> */
  function wirePasswordToggles() {
    document.querySelectorAll("[data-toggle-password]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-toggle-password");
        var input = document.getElementById(targetId);
        if (!input) return;
        var icon = btn.querySelector("i");
        if (input.type === "password") {
          input.type = "text";
          if (icon) { icon.classList.remove("bi-eye"); icon.classList.add("bi-eye-slash"); }
        } else {
          input.type = "password";
          if (icon) { icon.classList.remove("bi-eye-slash"); icon.classList.add("bi-eye"); }
        }
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  global.HarmoniApp = {
    API_BASE: API_BASE,
    DEFAULT_AVATAR: DEFAULT_AVATAR,
    purposeLabel: purposeLabel,
    genderLabel: genderLabel,
    escapeHtml: escapeHtml,
    requireAuth: requireAuth,
    requireProfile: requireProfile,
    initAppShell: initAppShell,
    showToast: showToast,
    showApiError: showApiError,
    formatMessageTime: formatMessageTime,
    wirePasswordToggles: wirePasswordToggles,
    isValidEmail: isValidEmail
  };
})(window);
