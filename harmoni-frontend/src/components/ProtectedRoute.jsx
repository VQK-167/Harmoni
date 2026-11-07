import { Navigate } from "react-router-dom";

// TODO: user === undefined -> đang kiểm tra, có thể return null/Loading
// TODO: user === null -> chưa đăng nhập, Navigate to="/login"
// TODO: requireProfile && !user.hasProfile -> Navigate to="/profile/create"
function ProtectedRoute({ user, requireProfile, children }) {
  return children;
}

export default ProtectedRoute;
