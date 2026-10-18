/**
 * matches.js
 * Danh sách Match (MAT-03, MAT-04): xem kết nối, nhắn tin, xem hồ sơ, hủy match.
 */

(function () {
  "use strict";

  async function initMatches() {
    var root = document.getElementById("matchesRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var grid = document.getElementById("matchesGrid");
    var emptyState = document.getElementById("matchesEmptyState");
    var confirmModalEl = document.getElementById("unmatchModal");
    var confirmModal = new bootstrap.Modal(confirmModalEl);
    var pendingMatchId = null;

    render();

    async function render() {
      var matches;
      try {
        matches = await HarmoniStore.getMatchesForUser();
      } catch (err) {
        HarmoniApp.showApiError(err, "Không tải được danh sách kết nối.");
        return;
      }

      if (!matches.length) {
        grid.innerHTML = "";
        emptyState.classList.remove("d-none");
        return;
      }
      emptyState.classList.add("d-none");

      grid.innerHTML = matches.map(function (m) {
        var p = m.otherProfile;
        var age = HarmoniStore.calcAge(p.dob);
        return (
          '<div class="col-sm-6 col-lg-4">' +
            '<div class="card-hm card-hm-hover match-card fade-in-up">' +
              '<div class="d-flex justify-content-end">' +
                '<div class="dropdown">' +
                  '<button class="btn btn-ghost-hm btn-sm" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>' +
                  '<ul class="dropdown-menu dropdown-menu-end">' +
                    '<li><a class="dropdown-item text-danger" href="#" data-unmatch="' + m.matchId + '"><i class="bi bi-x-circle me-2"></i>Hủy Match</a></li>' +
                  '</ul>' +
                '</div>' +
              '</div>' +
              '<img src="' + (p.avatar || HarmoniApp.DEFAULT_AVATAR) + '" alt="">' +
              '<div class="fw-bold">' + HarmoniApp.escapeHtml(p.displayName) + ', ' + age + '</div>' +
              '<div class="text-secondary-hm small mb-2"><i class="bi bi-geo-alt"></i> ' + HarmoniApp.escapeHtml(p.city) + '</div>' +
              '<span class="badge-hm badge-similarity">' + m.similarity + '% tương đồng</span>' +
              '<div class="match-actions">' +
                '<a href="messages.html?match=' + m.matchId + '" class="btn btn-gradient"><i class="bi bi-chat-dots"></i> Nhắn tin</a>' +
                '<a href="user-detail.html?id=' + m.otherUserId + '" class="btn btn-outline-hm"><i class="bi bi-eye"></i> Xem hồ sơ</a>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }).join("");

      grid.querySelectorAll("[data-unmatch]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          pendingMatchId = parseInt(btn.getAttribute("data-unmatch"), 10);
          confirmModal.show();
        });
      });
    }

    document.getElementById("confirmUnmatchBtn").addEventListener("click", function () {
      if (pendingMatchId === null) return;
      var matchId = pendingMatchId;
      pendingMatchId = null;
      HarmoniStore.unmatch(matchId)
        .then(function () {
          confirmModal.hide();
          HarmoniApp.showToast("Đã hủy Match.", "info");
          render();
        })
        .catch(function (err) {
          confirmModal.hide();
          HarmoniApp.showApiError(err, "Không thể hủy Match này.");
        });
    });
  }

  window.HarmoniMatches = { initMatches: initMatches };
})();
