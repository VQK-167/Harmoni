import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import DiscoverPage from "./pages/DiscoverPage";
import UserDetailPage from "./pages/UserDetailPage";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";
import MyProfilePage from "./pages/MyProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import BlockListPage from "./pages/BlockListPage";
import NotFoundPage from "./pages/NotFoundPage";

// TODO: giữ state user dùng chung toàn app (undefined = đang kiểm tra session, null = chưa đăng nhập, object = đã đăng nhập)
// TODO: useEffect gọi authMe() lúc mount để khôi phục session khi F5 trang
function App() {
  return (
    <div>
      {/* TODO: {showNavbar && <Navbar onLogout={...} />} */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/profile/create" element={<ProtectedRoute><CreateProfilePage /></ProtectedRoute>} />

        <Route path="/discover" element={<ProtectedRoute requireProfile><DiscoverPage /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute requireProfile><UserDetailPage /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute requireProfile><MatchesPage /></ProtectedRoute>} />
        <Route path="/matches/:id/chat" element={<ProtectedRoute requireProfile><ChatPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requireProfile><MyProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute requireProfile><EditProfilePage /></ProtectedRoute>} />
        <Route path="/blocks" element={<ProtectedRoute requireProfile><BlockListPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
