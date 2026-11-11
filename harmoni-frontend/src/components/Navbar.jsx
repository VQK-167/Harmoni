import { Link, NavLink } from "react-router-dom";

// Chi hien khi da dang nhap VA da co ho so (App.jsx quyet dinh).
function Navbar({ user, onLogout }) {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontWeight: isActive ? 700 : 500,
    color: isActive ? "#6B2D5B" : "#4A3D4C",
    borderBottom: isActive ? "2px solid #6B2D5B" : "2px solid transparent",
    paddingBottom: 3,
  });

  return (
    <nav className="navbar navbar-expand px-3 py-2 border-bottom bg-white">
      <Link
        className="navbar-brand fw-bold"
        to="/discover"
        style={{ color: "#6B2D5B", fontFamily: "Lora, serif" }}
      >
        Harmoni
      </Link>

      <div className="d-flex align-items-center gap-3 ms-auto">
        <NavLink to="/discover" style={linkStyle}>
          Khám phá
        </NavLink>
        <NavLink to="/matches" style={linkStyle}>
          Kết nối
        </NavLink>
        <NavLink to="/blocks" style={linkStyle}>
          Đã chặn
        </NavLink>
        <NavLink to="/profile" style={linkStyle}>
          {user?.displayName || "Hồ sơ"}
        </NavLink>
        <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
