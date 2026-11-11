// Hien thi mot tin nhan trong khung chat
function MessageBubble({ message, myUserId }) {
  // Tin cua minh thi hien ben phai
  const mine = message.sender_id === myUserId;

  return (
    <div
      className={
        mine
          ? "d-flex justify-content-end mb-2"
          : "d-flex justify-content-start mb-2"
      }
    >
      <div
        className={
          mine
            ? "bg-primary text-white rounded-3 px-3 py-2"
            : "bg-light rounded-3 px-3 py-2"
        }
        style={{ maxWidth: "75%" }}
      >
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {message.content}
        </div>

        <div
          className={
            mine
              ? "small text-white-50 mt-1"
              : "small text-secondary mt-1"
          }
        >
          {new Date(message.sent_at).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
