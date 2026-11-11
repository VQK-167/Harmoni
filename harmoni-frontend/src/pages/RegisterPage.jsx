import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authRegister } from "../api";

//AUTH_01
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setSaving(true);
    try {
      await authRegister({ email, password });
      alert("Đăng ký thành công, hãy đăng nhập");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h2 className="mb-1">Đăng ký</h2>
      <p className="text-secondary mb-4">
        Chỉ cần email và mật khẩu. Hồ sơ tạo ở bước sau.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="reg-pass">
            Mật khẩu
          </label>
          <input
            id="reg-pass"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-text">Tối thiểu 6 ký tự</div>
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="reg-pass2">
            Nhập lại mật khẩu
          </label>
          <input
            id="reg-pass2"
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-3 mb-0 text-center">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
