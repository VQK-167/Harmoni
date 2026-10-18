/**
 * discover.js
 * Xử lý Khám phá (DIS-01..05, LIKE-01..03), Chi tiết hồ sơ (DIS-02, DIS-03) và modal Match (MAT-01, MAT-02).
 */

(function () {
  "use strict";

  var DEFAULT_AVATAR = HarmoniApp.DEFAULT_AVATAR;

  function renderCommonChips(containerId, otherProfile, commonIds) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var commonSet = {};
    (commonIds || []).forEach(function (id) { commonSet[id] = true; });
    var interests = HarmoniStore.getInterestsByIds(otherProfile.interestIds);
    container.innerHTML = interests.map(function (it) {
      var cls = commonSet[it.id] ? "interest-chip static common" : "interest-chip static";
      return '<span class="' + cls + '"><i class="bi ' + it.icon + '"></i> ' + HarmoniApp.escapeHtml(it.name) + '</span>';
    }).join("");
  }

  /** Hiện modal Match thành công (MAT-01, MAT-02). onContinue() được gọi khi bấm "Tiếp tục khám phá". */
  function triggerMatchModal(meProfile, otherProfile, matchId, onContinue) {
    document.getElementById("matchModalAvatarMe").src = meProfile.avatar || DEFAULT_AVATAR;
    document.getElementById("matchModalAvatarOther").src = otherProfile.avatar || DEFAULT_AVATAR;
    document.getElementById("matchModalNames").textContent = meProfile.displayName + " & " + otherProfile.displayName;

    var modalEl = document.getElementById("matchModal");
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    var chatBtn = document.getElementById("matchModalChatBtn");
    var continueBtn = document.getElementById("matchModalContinueBtn");

    var chatHandler = function () { window.location.href = "messages.html?match=" + matchId; };
    var continueHandler = function () { modal.hide(); };

    chatBtn.onclick = chatHandler;
    continueBtn.onclick = continueHandler;

    modalEl.addEventListener("hidden.bs.modal", function handler() {
      modalEl.removeEventListener("hidden.bs.modal", handler);
      if (onContinue) onContinue();
    });

    modal.show();
  }

  // =======================================================================
  // DISCOVER (Khám phá)
  // =======================================================================

  async function initDiscover() {
    var root = document.getElementById("discoverRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var uid = HarmoniStore.getCurrentUserId();
    var deck = [];
    var meProfile = null;

    var cardWrap = document.getElementById("discoverCardWrap");
    var emptyState = document.getElementById("discoverEmptyState");
    var actionsBar = document.getElementById("discoverActions");
    var counterEl = document.getElementById("discoverCounter");

    try {
      await HarmoniStore.loadInterests();
      meProfile = await HarmoniStore.getProfile(uid);
      deck = await HarmoniStore.getDiscoverDeck(); // [{profile, similarity, commonInterestIds}]
    } catch (err) {
      HarmoniApp.showApiError(err, "Không tải được danh sách khám phá.");
      return;
    }

    render();

    function render() {
      if (!deck.length) {
        cardWrap.classList.add("d-none");
        actionsBar.classList.add("d-none");
        counterEl.classList.add("d-none");
        emptyState.classList.remove("d-none");
        return;
      }
      cardWrap.classList.remove("d-none");
      actionsBar.classList.remove("d-none");
      counterEl.classList.remove("d-none");
      emptyState.classList.add("d-none");

      var item = deck[0];
      var p = item.profile;
      var age = HarmoniStore.calcAge(p.dob);

      counterEl.textContent = deck.length + " hồ sơ phù hợp đang chờ bạn";

      cardWrap.innerHTML =
        '<div class="discover-card fade-in-up" id="activeDiscoverCard">' +
          '<div class="discover-card-photo">' +
            '<img src="' + (p.avatar || DEFAULT_AVATAR) + '" alt="' + HarmoniApp.escapeHtml(p.displayName) + '">' +
            '<span class="badge-hm badge-similarity similarity-pill">' + item.similarity + '% tương đồng</span>' +
          '</div>' +
          '<div class="discover-card-body">' +
            '<div class="d-flex justify-content-between align-items-start">' +
              '<div>' +
                '<div class="name-age">' + HarmoniApp.escapeHtml(p.displayName) + ', ' + age + ' tuổi</div>' +
                '<div class="city"><i class="bi bi-geo-alt"></i> ' + HarmoniApp.escapeHtml(p.city) + '</div>' +
              '</div>' +
              '<span class="badge-hm badge-purpose">' + HarmoniApp.purposeLabel(p.purpose) + '</span>' +
            '</div>' +
            '<p class="bio">“' + HarmoniApp.escapeHtml(p.bio) + '”</p>' +
            '<div class="discover-common-box">' +
              (item.commonInterestIds.length
                ? '<i class="bi bi-stars me-1"></i>Sở thích chung: <strong>' +
                  HarmoniStore.getInterestsByIds(item.commonInterestIds).map(function (i) { return i.name; }).join(", ") +
                  '</strong>'
                : '<i class="bi bi-info-circle me-1"></i>Chưa có sở thích chung nào.') +
            '</div>' +
          '</div>' +
        '</div>';
    }

    function advance() {
      deck.shift();
      render();
    }

    document.getElementById("btnPass").addEventListener("click", function () {
      if (!deck.length) return;
      var target = deck[0].profile.userId;
      var cardEl = document.getElementById("activeDiscoverCard");
      if (cardEl) cardEl.classList.add("swiping-left");
      HarmoniStore.recordSwipe(target, "pass").catch(function (err) {
        HarmoniApp.showApiError(err, "Không thể bỏ qua hồ sơ này.");
      });
      setTimeout(advance, 320);
    });

    document.getElementById("btnView").addEventListener("click", function () {
      if (!deck.length) return;
      var target = deck[0].profile.userId;
      window.location.href = "user-detail.html?id=" + target;
    });

    document.getElementById("btnLike").addEventListener("click", function () {
      if (!deck.length) return;
      var target = deck[0].profile.userId;
      var cardEl = document.getElementById("activeDiscoverCard");
      if (cardEl) cardEl.classList.add("swiping-right");

      HarmoniStore.recordSwipe(target, "like")
        .then(function (result) {
          setTimeout(function () {
            if (result.matched) {
              var otherProfile = deck[0].profile;
              deck.shift();
              triggerMatchModal(meProfile, otherProfile, result.matchId, render);
            } else {
              advance();
            }
          }, 320);
        })
        .catch(function (err) {
          HarmoniApp.showApiError(err, "Không thể Like hồ sơ này.");
        });
    });
  }

  // =======================================================================
  // USER DETAIL (chi tiết hồ sơ người khác)
  // =======================================================================

  async function initUserDetail() {
    var root = document.getElementById("userDetailRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var uid = HarmoniStore.getCurrentUserId();
    var params = new URLSearchParams(window.location.search);
    var targetId = parseInt(params.get("id"), 10);

    var notFoundBox = document.getElementById("udNotFound");
    var contentBox = document.getElementById("udContent");

    var meProfile = null;
    var detail = null;
    try {
      await HarmoniStore.loadInterests();
      meProfile = await HarmoniStore.getProfile(uid);
      detail = targetId === uid ? null : await HarmoniStore.getDiscoverDetail(targetId);
    } catch (err) {
      HarmoniApp.showApiError(err, "Không tải được hồ sơ này.");
      return;
    }

    if (!detail || detail.blocked) {
      notFoundBox.classList.remove("d-none");
      contentBox.classList.add("d-none");
      return;
    }

    var target = detail.profile;
    var age = HarmoniStore.calcAge(target.dob);

    document.getElementById("udAvatar").src = target.avatar || DEFAULT_AVATAR;
    document.getElementById("udNameAge").textContent = target.displayName + ", " + age + " tuổi";
    document.getElementById("udCity").textContent = target.city;
    document.getElementById("udBio").textContent = target.bio;
    document.getElementById("udPurpose").textContent = HarmoniApp.purposeLabel(target.purpose);
    document.getElementById("udSimilarity").textContent = detail.similarity + "%";
    renderCommonChips("udInterests", target, detail.commonInterestIds);

    var likeBtn = document.getElementById("udLikeBtn");
    var passBtn = document.getElementById("udPassBtn");
    var statusNote = document.getElementById("udStatusNote");

    if (detail.action) {
      likeBtn.disabled = true;
      passBtn.disabled = true;
      statusNote.classList.remove("d-none");
      statusNote.textContent = detail.action === "like"
        ? "Bạn đã Like hồ sơ này."
        : "Bạn đã bỏ qua hồ sơ này.";
    }

    passBtn.addEventListener("click", function () {
      HarmoniStore.recordSwipe(targetId, "pass")
        .then(function () {
          HarmoniApp.showToast("Đã bỏ qua " + target.displayName + ".", "info");
          setTimeout(function () { window.location.href = "discover.html"; }, 600);
        })
        .catch(function (err) { HarmoniApp.showApiError(err, "Không thể bỏ qua hồ sơ này."); });
    });

    likeBtn.addEventListener("click", function () {
      HarmoniStore.recordSwipe(targetId, "like")
        .then(function (result) {
          if (result.matched) {
            triggerMatchModal(meProfile, target, result.matchId, function () {
              window.location.href = "discover.html";
            });
          } else {
            HarmoniApp.showToast("Đã Like " + target.displayName + "!", "success");
            setTimeout(function () { window.location.href = "discover.html"; }, 700);
          }
        })
        .catch(function (err) { HarmoniApp.showApiError(err, "Không thể Like hồ sơ này."); });
    });

    // ---- Chặn / Báo cáo ----
    var blockConfirmBtn = document.getElementById("udConfirmBlockBtn");
    if (blockConfirmBtn) {
      blockConfirmBtn.addEventListener("click", function () {
        HarmoniStore.blockUser(targetId)
          .then(function () {
            bootstrap.Modal.getInstance(document.getElementById("udBlockModal")).hide();
            HarmoniApp.showToast("Đã chặn " + target.displayName + ".", "success");
            setTimeout(function () { window.location.href = "discover.html"; }, 700);
          })
          .catch(function (err) { HarmoniApp.showApiError(err, "Không thể chặn người dùng này."); });
      });
    }

    var reportForm = document.getElementById("udReportForm");
    if (reportForm) {
      document.getElementById("udReportTargetName").textContent = target.displayName;
      reportForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var reason = document.querySelector('input[name="udReportReason"]:checked');
        if (!reason) {
          document.getElementById("udReportReasonError").classList.remove("d-none");
          return;
        }
        document.getElementById("udReportReasonError").classList.add("d-none");
        var description = document.getElementById("udReportDescription").value.trim();
        HarmoniStore.addReport(targetId, reason.value, description)
          .then(function () {
            bootstrap.Modal.getInstance(document.getElementById("udReportModal")).hide();
            HarmoniApp.showToast("Đã gửi báo cáo. Harmoni sẽ xem xét sớm nhất.", "success");
            reportForm.reset();
          })
          .catch(function (err) { HarmoniApp.showApiError(err, "Không thể gửi báo cáo."); });
      });
    }
  }

  window.HarmoniDiscover = {
    initDiscover: initDiscover,
    initUserDetail: initUserDetail
  };
})();
