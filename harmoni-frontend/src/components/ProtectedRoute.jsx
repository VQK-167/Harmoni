import { Navigate } from "react-router-dom";

// Chan route theo 3 trang thai cua user: undefined, null, object

function ProtectedRoute({ user, requireProfile, children }) {
  if (user === undefined) return null;
  if (user === null) return <Navigate to="/login" replace />;
  if (requireProfile && !user.hasProfile) {
    return <Navigate to="/profile/create" replace />;
  }
  return children;
}

export default ProtectedRoute;
