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

  // Huy mot Match.
  async function handleUnmatch(matchId) {
    if (!window.confirm("Ban co chac muon huy ket noi nay khong?")) {
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
    return <div className="container py-5">Dang tai danh sach ket noi...</div>;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={loadMatches}>
          Thu lai
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="mb-1">Ket noi cua toi</h2>
      <p className="text-secondary mb-4">
        Cac Match cua ban va tin nhan moi nhat.
      </p>

      {matches.length === 0 ? (
        <div className="text-center py-5">
          <p className="mb-3">Ban chua co ket noi nao.</p>
          <Link className="btn btn-primary" to="/discover">
            Bat dau kham pha
          </Link>
        </div>
      ) : (
        <ul className="list-group">
          {matches.map((match) => (
            <li key={match.matchId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div style={{ minWidth: 0 }}>
                  <div className="fw-semibold">
                    {match.otherUser?.displayName || "Nguoi dung da xoa"}
                  </div>

                  <div className="text-secondary text-truncate small">
                    {match.lastMessage ? (
                      <>
                        {user && match.lastMessage.sender_id === user.id && (
                          <span>Ban: </span>
                        )}
                        {match.lastMessage.content}
                      </>
                    ) : (
                      <em>Chua co tin nhan nao.</em>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2 flex-shrink-0">
                  <Link
                    className="btn btn-primary btn-sm"
                    to={`/matches/${match.matchId}/chat`}
                  >
                    Nhan tin
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleUnmatch(match.matchId)}
                  >
                    Huy
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
