import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authLogin } from "../api";

//AUTH-02
function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); // chan trinh duyet reload trang
    setError("");
    setSaving(true);

    try {
      const res = await authLogin({ email, password });
      onLoginSuccess(res.data);

      // Dieu huong theo hasProfile: chua co ho so thi bat tao truoc
      navigate(res.data.hasProfile ? "/discover" : "/profile/create");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h2 className="mb-1">Đăng nhập</h2>
      <p className="text-secondary mb-4">Chào mừng bạn trở lại.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="log-email">
            Email
          </label>
          <input
            id="log-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="log-pass">
            Mật khẩu
          </label>
          <input
            id="log-pass"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-3 mb-0 text-center">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default LoginPage;
