import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  getInterests,
  updateProfile,
  updateInterests,
} from "../api";

// PRO-03, INT-03
// PRO-03 va INT-03 la HAI api rieng -> goi lan luot ca hai khi luu.
function EditProfilePage({ onProfileUpdated }) {
  const [interests, setInterests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState(null); // null = chua tai xong
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [profileRes, interestRes] = await Promise.all([
        getMyProfile(),
        getInterests(),
      ]);
      const p = profileRes.data;

      setInterests(interestRes.data || []);
      setSelectedIds(p.interestIds || []);
      setForm({
        displayName: p.displayName || "",
        // input type="date" can dang "YYYY-MM-DD", API tra ve dang ISO
        dateOfBirth: p.dateOfBirth ? String(p.dateOfBirth).slice(0, 10) : "",
        gender: p.gender || "UNDISCLOSED",
        city: p.city || "",
        bio: p.bio || "",
        connectionGoal: p.connectionGoal || "FRIENDSHIP",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleInterest(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.displayName.trim()) {
      setError("Tên hiển thị không được để trống");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Chọn ít nhất 1 sở thích");
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile(form); // PRO-03
      await updateInterests(selectedIds); // INT-03
      onProfileUpdated(res.data); // cap nhat ten tren Navbar
      alert("Cập nhật hồ sơ thành công");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error && !form) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  if (!form) return <div className="container py-5">Đang tải hồ sơ...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 680 }}>
      <h2 className="mb-4">Chỉnh sửa hồ sơ</h2>

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label" htmlFor="ep-name">
            Tên hiển thị <span className="text-danger">*</span>
          </label>
          <input
            id="ep-name"
            className="form-control"
            maxLength={100}
            value={form.displayName}
            onChange={(e) => setField("displayName", e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="ep-dob">
              Ngày sinh
            </label>
            <input
              id="ep-dob"
              type="date"
              className="form-control"
              value={form.dateOfBirth}
              onChange={(e) => setField("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="ep-gender">
              Giới tính
            </label>
            <select
              id="ep-gender"
              className="form-select"
              value={form.gender}
              onChange={(e) => setField("gender", e.target.value)}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
              <option value="UNDISCLOSED">Không muốn tiết lộ</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="ep-city">
            Thành phố
          </label>
          <input
            id="ep-city"
            className="form-control"
            maxLength={100}
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="ep-goal">
            Mục đích kết nối
          </label>
          <select
            id="ep-goal"
            className="form-select"
            value={form.connectionGoal}
            onChange={(e) => setField("connectionGoal", e.target.value)}
          >
            <option value="FRIENDSHIP">Kết bạn</option>
            <option value="DATING">Hẹn hò</option>
            <option value="LONG_TERM">Mối quan hệ lâu dài</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="ep-bio">
            Giới thiệu bản thân
          </label>
          <textarea
            id="ep-bio"
            className="form-control"
            rows="4"
            maxLength={1000}
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
          />
          <div className="form-text text-end">{form.bio.length} / 1000</div>
        </div>

        {/* INT-03 */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="form-label">
            Sở thích{" "}
            <span className="text-secondary fw-normal">
              — đã chọn {selectedIds.length}
            </span>
          </legend>
          <div className="d-flex flex-wrap gap-2">
            {interests.map((it) => {
              const active = selectedIds.includes(it.id);
              return (
                <button
                  key={it.id}
                  type="button"
                  className={
                    active
                      ? "btn btn-primary btn-sm rounded-pill"
                      : "btn btn-outline-secondary btn-sm rounded-pill"
                  }
                  onClick={() => toggleInterest(it.id)}
                >
                  {it.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/profile")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;
