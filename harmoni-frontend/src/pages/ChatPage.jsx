import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../api";
import MessageBubble from "../components/MessageBubble";

// Trang chat cua mot Match
function ChatPage({ user }) {
  // Lay matchId tu URL /matches/:id/chat
  const { id } = useParams();

  // Danh sach tin nhan dang hien thi
  const [messages, setMessages] = useState([]);

  // Trang thai Match
  const [matchStatus, setMatchStatus] = useState("ACTIVE");

  // Noi dung o input
  const [content, setContent] = useState("");

  // Trang thai dang tai lich su
  const [loading, setLoading] = useState(true);

  // Loi khi goi API
  const [error, setError] = useState("");

  // Trang thai dang gui tin
  const [sending, setSending] = useState(false);

  // Luu ID tin nhan cuoi ma khong lam component render lai
  const lastIdRef = useRef(0);

  // Khi mo ChatPage hoac doi matchId, tai lai toan bo lich su
  useEffect(() => {
    lastIdRef.current = 0;
    setMessages([]);
    loadAll();
  }, [id]);

  // Tu dong lay tin nhan moi moi 5 giay
  useEffect(() => {
    const timer = setInterval(() => {
      loadNew();
    }, 5000);

    // Roi khoi trang thi dung timer
    return () => {
      clearInterval(timer);
    };
  }, [id]);

  // Tai toan bo lich su tin nhan
  async function loadAll() {
    try {
      setLoading(true);
      setError("");

      const response = await getMessages(id);

      setMatchStatus(response.data.matchStatus);
      setMessages(response.data.messages || []);
      rememberLastId(response.data.messages || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Chi tai tin nhan moi hon tin nhan cuoi cung da biet
  async function loadNew() {
    try {
      const response = await getMessages(
        id,
        lastIdRef.current || undefined
      );

      setMatchStatus(response.data.matchStatus);

      const newMessages = response.data.messages || [];

      if (newMessages.length > 0) {
        setMessages((previousMessages) => [
          ...previousMessages,
          ...newMessages
        ]);

        rememberLastId(newMessages);
      }
    } catch (error) {
      // Khong alert vi ham nay chay tu dong moi 5 giay
      console.error("Loi lam moi tin nhan:", error.message);
    }
  }

  // Nho ID tin nhan cuoi cung
  function rememberLastId(messageList) {
    if (messageList.length > 0) {
      const lastMessage = messageList[messageList.length - 1];
      lastIdRef.current = lastMessage.id;
    }
  }

  // Xu ly form gui tin nhan
  async function handleSend(event) {
    event.preventDefault();

    const text = content.trim();

    if (!text) {
      return;
    }

    try {
      setSending(true);

      await sendMessage(id, text);

      setContent("");

      // Tai ngay tin nhan vua gui
      await loadNew();
    } catch (error) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        Đang tải cuộc trò chuyện...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link className="btn btn-link px-0" to="/matches">
          &larr; Kết nối
        </Link>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={loadNew}
        >
          Làm mới
        </button>
      </div>

      <div
        className="border rounded p-3 mb-3"
        style={{
          minHeight: 340,
          maxHeight: 460,
          overflowY: "auto"
        }}
      >
        {messages.length === 0 ? (
          <p className="text-secondary text-center mb-0">
            Chưa có tin nhắn nào. Hãy nói lời chào!
          </p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              myUserId={user.id}
            />
          ))
        )}
      </div>

      {matchStatus === "ACTIVE" ? (
        <form onSubmit={handleSend} className="d-flex gap-2">
          <label className="visually-hidden" htmlFor="chat-input">
            Nội dung tin nhắn
          </label>

          <input
            id="chat-input"
            className="form-control"
            placeholder="Nhập tin nhắn..."
            maxLength={1000}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <button
            className="btn btn-primary"
            disabled={sending}
          >
            {sending ? "..." : "Gửi"}
          </button>
        </form>
      ) : (
        <div className="alert alert-warning mb-0">
          Kết nối đã bị hủy, không thể gửi tin nhắn.
        </div>
      )}
    </div>
  );
}

export default ChatPage;
