// api.js — tầng gọi API dùng chung, mọi trang (pages/) chỉ gọi qua các hàm ở đây.
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // bắt buộc để trình duyệt gửi/nhận cookie session
});

function normalizeError(error) {
  // Backend co tra ve response loi.
  if (error.response) {
    const normalizedError = new Error(
      error.response.data?.message || "Co loi xay ra"
    );

    normalizedError.status = error.response.status;
    return normalizedError;
  }

  // Khong ket noi duoc den backend.
  const normalizedError = new Error(
    "Khong ket noi duoc den server"
  );

  normalizedError.status = 0;
  return normalizedError;
}

// --- Tài khoản (AUTH-01, AUTH-02, AUTH-03) ---
// TODO: authRegister({ email, password })
// TODO: authLogin({ email, password })
// TODO: authLogout()
// TODO: authMe() — KHÔNG throw khi chưa đăng nhập, trả data: null

// --- Sở thích & hồ sơ (INT-01..03, PRO-01..04) ---
// TODO: getInterests()
// TODO: createProfile({ name, birthDate, gender, city, bio, purpose, interestIds })
// TODO: getMyProfile()
// TODO: updateProfile({ name, birthDate, gender, city, bio, purpose })
// TODO: updateInterests(interestIds)

// --- Khám phá (DIS-01..05) ---
// Lay danh sach user de xuat
export async function discover(limit = 20) {
  try {
    const response = await http.get("/discover", {
      params: { limit }
    });

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// Lay chi tiet mot user
export async function getUserDetail(id) {
  try {
    const response = await http.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// --- Like/Pass & Match (LIKE-01..03, MAT-01..04) ---
// Gui hanh dong LIKE hoac PASS
export async function sendLike({ receiverId, action }) {
  try {
    const response = await http.post("/likes", {
      receiverId,
      action
    });

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// Lay danh sach Match
export async function getMatches() {
  try {
    const response = await http.get("/matches");

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// Huy Match
export async function unmatch(matchId) {
  try {
    const response = await http.patch(
      `/matches/${matchId}/unmatch`
    );

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// --- Nhắn tin (MSG-01..04) ---
// Lay tin nhan cua mot Match
export async function getMessages(matchId, afterId) {
  try {
    const params = {};

    // Neu co afterId thi chi lay tin nhan moi hon ID do
    if (afterId !== undefined && afterId !== null) {
      params.afterId = afterId;
    }

    const response = await http.get(
      `/matches/${matchId}/messages`,
      { params }
    );

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// Gui tin nhan trong mot Match
export async function sendMessage(matchId, content) {
  try {
    const response = await http.post(
      `/matches/${matchId}/messages`,
      { content }
    );

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// --- An toàn (SAF-01..04) ---
// TODO: blockUser(userId)
// TODO: getBlocks()
// TODO: unblockUser(userId)
// TODO: reportUser({ targetUserId, reason, detail })

export { http };
