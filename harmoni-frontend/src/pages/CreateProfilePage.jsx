import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInterests, createProfile } from "../api";

// PRO-01, PRO-04, INT-02, SAF-04
function CreateProfilePage({ onProfileCreated }) {
  const [interests, setInterests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState({
    displayName: "",
    dateOfBirth: "",
    gender: "UNDISCLOSED",
    city: "",
    bio: "",
    connectionGoal: "FRIENDSHIP",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // Mang rong [] = chay 1 lan khi mount
  useEffect(() => {
    loadInterests();
  }, []);

  async function loadInterests() {
    try {
      const res = await getInterests();
      setInterests(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  // Cap nhat 1 truong, giu nguyen cac truong khac
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  //chon nhieu so thich, bam lan nua thi bo chon
  function toggleInterest(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.displayName.trim() || !form.dateOfBirth || !form.city.trim()) {
      setError("Vui lòng nhập tên, ngày sinh và thành phố");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Chọn ít nhất 1 sở thích để hệ thống gợi ý người phù hợp");
      return;
    }

    setSaving(true);
    try {
      const res = await createProfile({ ...form, interestIds: selectedIds });
      onProfileCreated(res.data); // bao App.jsx biet da co ho so
      navigate("/discover");
    } catch (err) {
      //backend kiem tra
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 680 }}>
      <p
        className="text-uppercase fw-bold small text-secondary mb-2"
        style={{ letterSpacing: "0.12em" }}
      >
        Bước 2 trên 2
      </p>
      <h2 className="mb-1">Tạo hồ sơ</h2>
      <p className="text-secondary mb-4">
        Harmoni dùng sở thích và mục đích kết nối của bạn để tìm người phù hợp.
        Ảnh đại diện dùng ảnh mặc định, chưa cần tải lên.
      </p>

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label" htmlFor="cp-name">
            Tên hiển thị <span className="text-danger">*</span>
          </label>
          <input
            id="cp-name"
            className="form-control"
            maxLength={100}
            value={form.displayName}
            onChange={(e) => setField("displayName", e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="cp-dob">
              Ngày sinh <span className="text-danger">*</span>
            </label>
            <input
              id="cp-dob"
              type="date"
              className="form-control"
              value={form.dateOfBirth}
              onChange={(e) => setField("dateOfBirth", e.target.value)}
            />
            <div className="form-text">Phải từ 18 tuổi trở lên</div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="cp-gender">
              Giới tính
            </label>
            <select
              id="cp-gender"
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
          <label className="form-label" htmlFor="cp-city">
            Thành phố <span className="text-danger">*</span>
          </label>
          <input
            id="cp-city"
            className="form-control"
            maxLength={100}
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
          />
        </div>

        {/* PRO-04 */}
        <div className="mb-3">
          <label className="form-label" htmlFor="cp-goal">
            Mục đích kết nối <span className="text-danger">*</span>
          </label>
          <select
            id="cp-goal"
            className="form-select"
            value={form.connectionGoal}
            onChange={(e) => setField("connectionGoal", e.target.value)}
          >
            <option value="FRIENDSHIP">Kết bạn</option>
            <option value="DATING">Hẹn hò</option>
            <option value="LONG_TERM">Mối quan hệ lâu dài</option>
          </select>
          <div className="form-text">
            Người khác sẽ thấy mục đích này trên hồ sơ của bạn
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="cp-bio">
            Giới thiệu bản thân
          </label>
          <textarea
            id="cp-bio"
            className="form-control"
            rows="4"
            maxLength={1000}
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
          />
          <div className="form-text text-end">{form.bio.length} / 1000</div>
        </div>

        {/* INT-02 */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="form-label">
            Sở thích <span className="text-danger">*</span>{" "}
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

          {interests.length === 0 && (
            <div className="form-text text-danger">
              Chưa có sở thích nào. Hãy seed bảng interests trong DataGrip.
            </div>
          )}
        </fieldset>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Đang lưu..." : "Hoàn tất hồ sơ"}
        </button>
      </form>
    </div>
  );
}

export default CreateProfilePage;
