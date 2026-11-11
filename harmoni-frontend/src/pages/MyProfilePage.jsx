import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile, getInterests, GENDER_LABEL, GOAL_LABEL } from "../api";

// PRO-02
//goi HAI api: getMyProfile (tra interestIds dang SO) va getInterests (de tra ra TEN so thich).
function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      // Promise.all: goi song song 2 api thay vi cho tuan tu
      const [profileRes, interestRes] = await Promise.all([
        getMyProfile(),
        getInterests(),
      ]);
      setProfile(profileRes.data);
      setInterests(interestRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-5">Đang tải hồ sơ...</div>;
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  if (!profile) return <div className="container py-5">Bạn chưa tạo hồ sơ.</div>;

  // Doi tu mang id sang mang ten so thich
  const myInterestNames = interests
    .filter((it) => profile.interestIds.includes(it.id))
    .map((it) => it.name);

  return (
    <div className="container py-5" style={{ maxWidth: 680 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Hồ sơ của tôi</h2>
        <Link className="btn btn-outline-primary btn-sm" to="/profile/edit">
          Chỉnh sửa
        </Link>
      </div>

      <div className="card p-4 mb-3">
        <div className="d-flex align-items-center gap-3 mb-4">
          {/* Chua co chuc nang upload anh -> dung chu cai dau cua ten */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 72,
              height: 72,
              background: "#F3E7EF",
              fontSize: 28,
              color: "#9B7A95",
            }}
          >
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="h4 mb-1">
              {profile.displayName}, {profile.age}
            </h3>
            <div className="text-secondary">
              {profile.city || "Chưa cập nhật"}
            </div>
          </div>
          <span className="badge rounded-pill ms-auto text-bg-light border">
            {GOAL_LABEL[profile.connectionGoal] || profile.connectionGoal}
          </span>
        </div>

        <dl className="row mb-0">
          <dt className="col-sm-4 text-secondary fw-normal">Giới tính</dt>
          <dd className="col-sm-8">
            {GENDER_LABEL[profile.gender] || profile.gender}
          </dd>

          <dt className="col-sm-4 text-secondary fw-normal">Ngày sinh</dt>
          <dd className="col-sm-8">
            {new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")}
          </dd>

          <dt className="col-sm-4 text-secondary fw-normal">Thành phố</dt>
          <dd className="col-sm-8">{profile.city || "Chưa cập nhật"}</dd>

          <dt className="col-sm-4 text-secondary fw-normal">Giới thiệu</dt>
          <dd className="col-sm-8 mb-0">{profile.bio || "Chưa cập nhật"}</dd>
        </dl>
      </div>

      <div className="card p-4">
        <h4
          className="text-uppercase small text-secondary mb-3"
          style={{ letterSpacing: "0.1em" }}
        >
          Sở thích của tôi
        </h4>
        <div className="d-flex flex-wrap gap-2">
          {myInterestNames.length > 0 ? (
            myInterestNames.map((name) => (
              <span key={name} className="badge rounded-pill text-bg-light border">
                {name}
              </span>
            ))
          ) : (
            <span className="text-secondary">Chưa chọn sở thích nào</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
