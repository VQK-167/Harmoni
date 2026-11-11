import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { discover, sendLike, getInterests, GOAL_LABEL } from "../api";
import MatchPopup from "../components/MatchPopup";

// Trang hien thi danh sach user de xuat.
function DiscoverPage() {
  const [list, setList] = useState([]);
  const [interestNames, setInterestNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    load();
  }, []);

  // Goi song song API Discovery va API danh sach interest.
  async function load() {
    try {
      setLoading(true);
      setError("");

      const [discoverResponse, interestResponse] = await Promise.all([
        discover(20),
        getInterests()
      ]);

      const interestMap = {};

      for (const interest of interestResponse.data || []) {
        interestMap[interest.id] = interest.name;
      }

      setInterestNames(interestMap);
      setList(discoverResponse.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Gui LIKE hoac PASS cho user dang hien thi.
  async function handleAction(person, action) {
    try {
      setActing(true);
      setError("");

      const response = await sendLike({
        receiverId: person.userId,
        action
      });

      // User vua thao tac khong hien lai trong danh sach.
      setList((previousList) =>
        previousList.filter((item) => item.userId !== person.userId)
      );

      if (response.data?.matched) {
        setMatchInfo({
          displayName: person.displayName,
          matchId: response.data.matchId
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return <div className="container py-5">Dang tai danh sach de xuat...</div>;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={load}>
          Thu lai
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 820 }}>
      <h2 className="mb-1">Kham pha</h2>
      <p className="text-secondary mb-4">
        Danh sach duoc sap xep theo do tuong dong so thich.
      </p>

      {list.length === 0 ? (
        <div className="text-center py-5">
          <p className="mb-3">Ban da xem het ho so phu hop.</p>
          <Link className="btn btn-outline-primary" to="/matches">
            Xem ket noi cua toi
          </Link>
        </div>
      ) : (
        list.map((person) => (
          <div key={person.userId} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="mb-0">
                    {person.displayName}, {person.age}
                  </h5>
                  <small className="text-secondary">
                    {person.city} - {GOAL_LABEL[person.connectionGoal] || person.connectionGoal}
                  </small>
                </div>
                <span className="badge text-bg-success fs-6">
                  {person.similarity}%
                </span>
              </div>

              {person.bio && <p className="mb-2">{person.bio}</p>}

              {person.commonInterestIds?.length > 0 && (
                <div className="mb-3">
                  <small className="text-secondary d-block mb-1">
                    So thich chung:
                  </small>
                  <div className="d-flex flex-wrap gap-1">
                    {person.commonInterestIds.map((interestId) => (
                      <span key={interestId} className="badge text-bg-light border">
                        {interestNames[interestId] || `Interest ${interestId}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={acting}
                  onClick={() => handleAction(person, "LIKE")}
                >
                  Thich
                </button>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={acting}
                  onClick={() => handleAction(person, "PASS")}
                >
                  Bo qua
                </button>

                <Link
                  className="btn btn-link btn-sm ms-auto"
                  to={`/users/${person.userId}`}
                >
                  Xem chi tiet
                </Link>
              </div>
            </div>
          </div>
        ))
      )}

      {matchInfo && (
        <MatchPopup
          displayName={matchInfo.displayName}
          matchId={matchInfo.matchId}
          onClose={() => setMatchInfo(null)}
        />
      )}
    </div>
  );
}

export default DiscoverPage;
