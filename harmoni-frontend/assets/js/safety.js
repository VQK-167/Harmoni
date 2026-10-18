/**
 * safety.js
 * An toàn & quyền riêng tư (SAF-01..04): danh sách người đã chặn + bỏ chặn.
 * Việc Chặn và Báo cáo một người dùng cụ thể được thực hiện ở user-detail.html (xem discover.js).
 */

(function () {
  "use strict";

  async function initSafety() {
    var root = document.getElementById("safetyRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var listEl = document.getElementById("blockedList");
    var emptyEl = document.getElementById("blockedEmptyState");

    render();

    async function render() {
      var blocked;
      try {
        blocked = await HarmoniStore.getBlockedUsers();
      } catch (err) {
        HarmoniApp.showApiError(err, "Không tải được danh sách đã chặn.");
        return;
      }

      if (!blocked.length) {
        listEl.innerHTML = "";
        emptyEl.classList.remove("d-none");
        return;
      }
      emptyEl.classList.add("d-none");

      listEl.innerHTML = blocked.map(function (b) {
        var p = b.profile;
        if (!p) return "";
        return (
          '<div class="blocked-item fade-in-up">' +
            '<img src="' + (p.avatar || HarmoniApp.DEFAULT_AVATAR) + '" alt="">' +
            '<div class="flex-grow-1">' +
              '<div class="fw-bold">' + HarmoniApp.escapeHtml(p.displayName) + '</div>' +
              '<div class="small text-secondary-hm"><i class="bi bi-geo-alt"></i> ' + HarmoniApp.escapeHtml(p.city) + '</div>' +
            '</div>' +
            '<button type="button" class="btn btn-outline-hm" data-unblock="' + b.userId + '">Bỏ chặn</button>' +
          '</div>'
        );
      }).join("");

      listEl.querySelectorAll("[data-unblock]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var targetId = parseInt(btn.getAttribute("data-unblock"), 10);
          HarmoniStore.unblockUser(targetId)
            .then(function () {
              HarmoniApp.showToast("Đã bỏ chặn người dùng.", "success");
              render();
            })
            .catch(function (err) { HarmoniApp.showApiError(err, "Không thể bỏ chặn người dùng này."); });
        });
      });
    }
  }

  window.HarmoniSafety = { initSafety: initSafety };
})();
