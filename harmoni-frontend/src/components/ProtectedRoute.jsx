import { Navigate } from "react-router-dom";

// Chan route theo 3 trang thai cua user:
//   undefined -> dang goi authMe(), chua biet gi, khong ve gi ca
//   null      -> chua dang nhap, day ve /login
//   object    -> da dang nhap; neu route yeu cau co ho so ma chua co
//                thi day ve /profile/create
//
// replace: thay the entry trong history, de bam Back khong quay lai
// trang vua bi chan.
function ProtectedRoute({ user, requireProfile, children }) {
  if (user === undefined) return null;
  if (user === null) return <Navigate to="/login" replace />;
  if (requireProfile && !user.hasProfile) {
    return <Navigate to="/profile/create" replace />;
  }
  return children;
}

export default ProtectedRoute;
