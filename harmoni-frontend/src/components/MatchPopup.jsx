import { Link } from "react-router-dom";

// Hien thong bao khi hai user da Like nhau
function MatchPopup({ displayName, matchId, onClose }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0, 0, 0, 0.55)",
        zIndex: 1050
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3 p-4 text-center shadow"
        style={{ maxWidth: 380 }}
        onClick={(event) => event.stopPropagation()}
      >
        <h4 className="mb-2">
          Kết nối thành công!
        </h4>

        <p className="mb-4">
          Bạn và <strong>{displayName}</strong> đã thích nhau.
        </p>

        <div className="d-flex gap-2 justify-content-center">
          <Link
            className="btn btn-primary"
            to={`/matches/${matchId}/chat`}
          >
            Nhắn tin ngay
          </Link>

          <button
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Tiếp tục khám phá
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchPopup;
