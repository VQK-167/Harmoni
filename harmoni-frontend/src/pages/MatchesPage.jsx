import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMatches, unmatch } from "../api";

// Trang hien thi danh sach cac Match.
function MatchesPage({ user }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  // Lay danh sach Match tu Backend.
  async function loadMatches() {
    try {
      setLoading(true);
      setError("");

      const response = await getMatches();
      setMatches(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Hủy mot Match.
  async function handleUnmatch(matchId) {
    if (!window.confirm("Bạn có chắc muốn hủy kết nối này không?")) {
      return;
    }

    try {
      await unmatch(matchId);

      // Xoa Match vua huy khoi giao dien.
      setMatches((previousMatches) =>
        previousMatches.filter((match) => match.matchId !== matchId)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return <div className="container py-5">Đang tải danh sách kết nối...</div>;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={loadMatches}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="mb-1">Kết nối của tôi</h2>
      <p className="text-secondary mb-4">
        Các Match của bạn và tin nhắn mới nhất.
      </p>

      {matches.length === 0 ? (
        <div className="text-center py-5">
          <p className="mb-3">Bạn chưa có kết nối nào.</p>
          <Link className="btn btn-primary" to="/discover">
            Bắt đầu khám phá
          </Link>
        </div>
      ) : (
        <ul className="list-group">
          {matches.map((match) => (
            <li key={match.matchId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div style={{ minWidth: 0 }}>
                  <div className="fw-semibold">
                    {match.otherUser?.displayName || "Người dùng đã xóa"}
                  </div>

                  <div className="text-secondary text-truncate small">
                    {match.lastMessage ? (
                      <>
                        {user && match.lastMessage.sender_id === user.id && (
                          <span>Bạn:</span>
                        )}
                        {match.lastMessage.content}
                      </>
                    ) : (
                      <em>Chưa có tin nhắn nào.</em>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2 flex-shrink-0">
                  <Link
                    className="btn btn-outline-primary btn-sm"
                    to={`/users/${match.otherUser?.userId}`}
                  >
                    Xem chi tiết
                  </Link>
                  <Link
                    className="btn btn-primary btn-sm"
                    to={`/matches/${match.matchId}/chat`}
                  >
                    Nhắn tin
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleUnmatch(match.matchId)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchesPage;
