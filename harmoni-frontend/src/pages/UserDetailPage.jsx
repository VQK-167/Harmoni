import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserDetail,
  getInterests,
  sendLike,
  blockUser,
  reportUser,
  REPORT_REASONS,
  GOAL_LABEL
} from "../api";
import MatchPopup from "../components/MatchPopup";

// Trang hien thi chi tiet mot user.
function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [interestNames, setInterestNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchInfo, setMatchInfo] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS?.[0]?.value || "OTHER");
  const [description, setDescription] = useState("");

  useEffect(() => {
    load();
  }, [id]);

  // Lay thong tin profile va ten cac interest.
  async function load() {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, interestResponse] = await Promise.all([
        getUserDetail(id),
        getInterests()
      ]);

      const interestMap = {};

      for (const interest of interestResponse.data || []) {
        interestMap[interest.id] = interest.name;
      }

      setInterestNames(interestMap);
      setProfile(profileResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Gui LIKE hoac PASS tu trang chi tiet.
  async function handleAction(action) {
    try {
      const response = await sendLike({
        receiverId: profile.userId,
        action
      });

      if (response.data?.matched) {
        setMatchInfo({
          displayName: profile.displayName,
          matchId: response.data.matchId
        });
      } else {
        navigate("/discover");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  // Goi API block cua Khai.
  async function handleBlock() {
    if (!window.confirm("Bạn có chắc muốn chặn người này không?")) {
      return;
    }

    try {
      await blockUser(profile.userId);
      alert("Đã chặn người dùng");
      navigate("/discover");
    } catch (err) {
      alert(err.message);
    }
  }

  // Goi API report cua Khai.
  async function handleReport(event) {
    event.preventDefault();

    try {
      await reportUser({
        reportedId: profile.userId,
        reason,
        description
      });

      alert("Đã gửi báo cáo");
      setShowReport(false);
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return <div className="container py-5">Đang tải profile...</div>;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <button className="btn btn-link px-0 mb-3" onClick={() => navigate(-1)}>
        &larr; Quay lại
      </button>

      <div className="card p-4 mb-3">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h3 className="mb-1">
              {profile.displayName}, {profile.age}
            </h3>
            <div className="text-secondary mb-2">{profile.city}</div>
            <span className="badge rounded-pill text-bg-light border">
              {GOAL_LABEL[profile.connectionGoal] || profile.connectionGoal}
            </span>
          </div>

          <span className="badge text-bg-success fs-5">
            {profile.similarity}%
          </span>
        </div>

        {profile.bio && <p className="mb-4">{profile.bio}</p>}

        <h6 className="text-uppercase small text-secondary">
          Sở thích chung ({profile.commonInterestIds?.length || 0})
        </h6>
        <div className="d-flex flex-wrap gap-1 mb-3">
          {profile.commonInterestIds?.length > 0 ? (
            profile.commonInterestIds.map((interestId) => (
              <span key={interestId} className="badge text-bg-success">
                {interestNames[interestId] || `Interest ${interestId}`}
              </span>
            ))
          ) : (
            <span className="text-secondary">Chưa có sở thích chung</span>
          )}
        </div>

        <h6 className="text-uppercase small text-secondary">
          Tất cả sở thích
        </h6>
        <div className="d-flex flex-wrap gap-1 mb-4">
          {(profile.interestIds || []).map((interestId) => (
            <span key={interestId} className="badge text-bg-light border">
              {interestNames[interestId] || `Interest ${interestId}`}
            </span>
          ))}
        </div>

        {profile.isBlocked ? (
          <div className="alert alert-warning mb-0">
            Hai bạn đang chặn nhau, không thể tương tác.
          </div>
        ) : (
          <div className="d-flex gap-2">
            {profile.myAction === null && (
              <>
                <button className="btn btn-primary" onClick={() => handleAction("LIKE")}>
                  Thích
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleAction("PASS")}
                >
                  Bỏ qua
                </button>
              </>
            )}

            {profile.myAction === "LIKE" && (
              <span className="text-success align-self-center">
                Bạn đã thích người này
              </span>
            )}

            {profile.myAction === "PASS" && (
              <button className="btn btn-primary" onClick={() => handleAction("LIKE")}>
                Đổi ý, thích người này
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h6 className="text-uppercase small text-secondary">An toàn</h6>
        <div className="d-flex gap-2">
          {!profile.isBlocked && (
            <button className="btn btn-outline-danger btn-sm" onClick={handleBlock}>
              Chặn người này
            </button>
          )}
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setShowReport((value) => !value)}
          >
            Báo cáo
          </button>
        </div>

        {showReport && (
          <form className="border rounded p-3 mt-3" onSubmit={handleReport}>
            <label className="form-label" htmlFor="report-reason">
              Lý do báo cáo
            </label>
            <select
              id="report-reason"
              className="form-select mb-3"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {(REPORT_REASONS || []).map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <textarea
              className="form-control mb-3"
              rows="3"
              maxLength={1000}
              placeholder="Mô tả thêm"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <button type="submit" className="btn btn-danger btn-sm">
              Gửi báo cáo
            </button>
          </form>
        )}
      </div>

      {matchInfo && (
        <MatchPopup
          displayName={matchInfo.displayName}
          matchId={matchInfo.matchId}
          onClose={() => navigate("/discover")}
        />
      )}
    </div>
  );
}

export default UserDetailPage;
