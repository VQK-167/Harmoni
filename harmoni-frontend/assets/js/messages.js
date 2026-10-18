/**
 * messages.js
 * Nhắn tin (MSG-01..04): chỉ hiển thị người đã Match, gửi/nhận tin nhắn qua API thật.
 */

(function () {
  "use strict";

  async function initMessages() {
    var root = document.getElementById("messagesRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var uid = HarmoniStore.getCurrentUserId();
    var listEl = document.getElementById("conversationList");
    var shellEl = document.getElementById("messagesShell");
    var chatEmptyEl = document.getElementById("chatEmptyState");
    var chatActiveEl = document.getElementById("chatActivePanel");
    var listEmptyEl = document.getElementById("conversationListEmpty");

    var params = new URLSearchParams(window.location.search);
    var activeMatchId = params.get("match") ? parseInt(params.get("match"), 10) : null;
    var matchesCache = [];

    if (activeMatchId !== null) {
      // Đến từ liên kết "Nhắn tin" của một match cụ thể -> trên mobile mở luôn khung chat
      shellEl.classList.add("chat-open");
    }

    renderConversationList();

    async function renderConversationList() {
      try {
        matchesCache = await HarmoniStore.getMatchesForUser();
      } catch (err) {
        HarmoniApp.showApiError(err, "Không tải được danh sách hội thoại.");
        return;
      }

      if (!matchesCache.length) {
        listEl.innerHTML = "";
        listEmptyEl.classList.remove("d-none");
        showChatEmpty();
        return;
      }
      listEmptyEl.classList.add("d-none");

      // Sắp xếp theo tin nhắn mới nhất (BE trả kèm lastMessage cho mỗi match)
      var items = matchesCache.slice().sort(function (a, b) {
        var ta = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.matchedAt).getTime();
        var tb = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.matchedAt).getTime();
        return tb - ta;
      });

      if (activeMatchId === null) activeMatchId = items[0].matchId;
      var stillValid = items.some(function (m) { return m.matchId === activeMatchId; });
      if (!stillValid) activeMatchId = items[0].matchId;

      listEl.innerHTML = items.map(function (m) {
        var p = m.otherProfile;
        var preview = m.lastMessage ? m.lastMessage.text : "Hãy bắt đầu cuộc trò chuyện!";
        var time = m.lastMessage ? HarmoniApp.formatMessageTime(m.lastMessage.createdAt) : "";
        var activeCls = m.matchId === activeMatchId ? " active" : "";
        return (
          '<div class="conversation-item' + activeCls + '" data-match-id="' + m.matchId + '">' +
            '<img src="' + (p.avatar || HarmoniApp.DEFAULT_AVATAR) + '" alt="">' +
            '<div class="meta">' +
              '<div class="top-row"><span class="name">' + HarmoniApp.escapeHtml(p.displayName) + '</span><span class="time">' + time + '</span></div>' +
              '<div class="last-msg">' + HarmoniApp.escapeHtml(preview) + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join("");

      listEl.querySelectorAll(".conversation-item").forEach(function (el) {
        el.addEventListener("click", function () {
          activeMatchId = parseInt(el.getAttribute("data-match-id"), 10);
          listEl.querySelectorAll(".conversation-item").forEach(function (x) { x.classList.remove("active"); });
          el.classList.add("active");
          renderChatPanel();
          shellEl.classList.add("chat-open");
        });
      });

      renderChatPanel();
    }

    function currentMatch() {
      return matchesCache.filter(function (m) { return m.matchId === activeMatchId; })[0] || null;
    }

    function renderChatPanel() {
      var match = currentMatch();
      if (!match) { showChatEmpty(); return; }

      chatEmptyEl.classList.add("d-none");
      chatActiveEl.classList.remove("d-none");

      var p = match.otherProfile;
      document.getElementById("chatHeaderAvatar").src = p.avatar || HarmoniApp.DEFAULT_AVATAR;
      document.getElementById("chatHeaderName").textContent = p.displayName;
      document.getElementById("chatHeaderCity").textContent = p.city;
      document.getElementById("chatViewProfileLink").href = "user-detail.html?id=" + match.otherUserId;

      renderMessages(match);
    }

    async function renderMessages(match) {
      var box = document.getElementById("chatMessages");
      var msgs;
      try {
        msgs = await HarmoniStore.getMessages(match.matchId);
      } catch (err) {
        HarmoniApp.showApiError(err, "Không tải được tin nhắn.");
        return;
      }
      if (!msgs.length) {
        box.innerHTML = '<p class="text-center text-secondary-hm small mt-4">Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!</p>';
        return;
      }
      box.innerHTML = msgs.map(function (m) {
        var mine = m.senderId === uid;
        return (
          '<div class="msg-row ' + (mine ? "sent" : "received") + '">' +
            '<div>' +
              '<div class="msg-bubble">' + HarmoniApp.escapeHtml(m.text) + '</div>' +
              '<div class="msg-time">' + HarmoniApp.formatMessageTime(m.createdAt) + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join("");
      box.scrollTop = box.scrollHeight;
    }

    function showChatEmpty() {
      chatActiveEl.classList.add("d-none");
      chatEmptyEl.classList.remove("d-none");
    }

    document.getElementById("chatForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("chatInput");
      var text = input.value.trim();
      var match = currentMatch();
      if (!text || !match) return;
      input.value = "";
      HarmoniStore.addMessage(match.matchId, text)
        .then(function () {
          renderMessages(match);
          renderConversationList();
        })
        .catch(function (err) {
          input.value = text;
          HarmoniApp.showApiError(err, "Không thể gửi tin nhắn.");
        });
    });

    document.getElementById("refreshMessagesBtn").addEventListener("click", function () {
      renderConversationList();
      HarmoniApp.showToast("Đã làm mới tin nhắn.", "info");
    });

    var backBtn = document.getElementById("chatBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function () { shellEl.classList.remove("chat-open"); });
    }
  }

  window.HarmoniMessages = { initMessages: initMessages };
})();
