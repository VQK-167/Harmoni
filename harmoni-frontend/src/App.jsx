import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { authMe, authLogout } from "./api";

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

function App() {
  // user co BA trang thai, khong phai hai:
  //   undefined = dang goi authMe(), CHUA BIET
  //   null      = chac chan chua dang nhap
  //   object    = da dang nhap
  // Neu khoi tao bang null thi luc F5, ProtectedRoute thay null va day
  // ve /login NGAY TRUOC KHI authMe() tra loi -> nguoi dang dang nhap
  // van bi tong ra. Vi vay phai co trang thai thu ba.
  const [user, setUser] = useState(undefined);

  // Mang rong [] = chay 1 lan sau khi component mount.
  // Tuong duong componentDidMount cua class component.
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await authMe();
      setUser(res.data); // data = null neu chua dang nhap
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }

  // LoginPage goi ham nay de day du lieu user len App (lifting state up)
  function handleLoginSuccess(loginData) {
    setUser(loginData);
  }

  function handleProfileCreated(profile) {
    setUser((prev) => ({
      ...prev,
      hasProfile: true,
      displayName: profile.displayName,
    }));
  }

  function handleProfileUpdated(profile) {
    setUser((prev) => ({ ...prev, displayName: profile.displayName }));
  }

  async function handleLogout() {
    try {
      await authLogout();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  }

  // Dang goi authMe, chua biet gi -> khong ve route nao de tranh nhay
  // trang. Thieu doan nay la F5 bi day ve /login.
  if (user === undefined) {
    return (
      <div className="container py-5 text-center text-secondary">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  const showNavbar = !!(user && user.hasProfile);

  return (
    <div>
      {showNavbar && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        <Route
          path="/profile/create"
          element={
            <ProtectedRoute user={user}>
              <CreateProfilePage onProfileCreated={handleProfileCreated} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/discover"
          element={
            <ProtectedRoute user={user} requireProfile>
              <DiscoverPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute user={user} requireProfile>
              <UserDetailPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute user={user} requireProfile>
              <MatchesPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches/:id/chat"
          element={
            <ProtectedRoute user={user} requireProfile>
              <ChatPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} requireProfile>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute user={user} requireProfile>
              <EditProfilePage onProfileUpdated={handleProfileUpdated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blocks"
          element={
            <ProtectedRoute user={user} requireProfile>
              <BlockListPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
