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

// ----- Tai khoan (AUTH-01, 02, 03) -----

export async function authRegister({ email, password }) {
  try {
    const response = await http.post("/auth/register", { email, password });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function authLogin({ email, password }) {
  try {
    const response = await http.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function authLogout() {
  try {
    const response = await http.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// Backend tra 200 kem data: null khi chua dang nhap -> ham nay
// KHONG throw trong truong hop binh thuong do.
export async function authMe() {
  try {
    const response = await http.get("/auth/me");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// ----- So thich (INT-01, 02, 03) -----

export async function getInterests() {
  try {
    const response = await http.get("/interests");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function updateInterests(interestIds) {
  try {
    const response = await http.put("/profile/me/interests", { interestIds });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// ----- Ho so (PRO-01, 02, 03, 04) -----

export async function createProfile(payload) {
  try {
    const response = await http.post("/profile", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getMyProfile() {
  try {
    const response = await http.get("/profile/me");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function updateProfile(payload) {
  try {
    const response = await http.put("/profile/me", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

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

// ----- An toan (SAF-01, 02, 03) -----

export async function blockUser(userId) {
  try {
    const response = await http.post("/blocks", { userId });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getBlocks() {
  try {
    const response = await http.get("/blocks");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function unblockUser(userId) {
  try {
    const response = await http.delete(`/blocks/${userId}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function reportUser({ reportedId, reason, description }) {
  try {
    const response = await http.post("/reports", {
      reportedId,
      reason,
      description,
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// ----- Cac hang so dung chung cho nhieu trang -----

// Dropdown bao cao (SAF-03). Gia tri ben trai PHAI khop ENUM trong DB.
export const REPORT_REASONS = [
  { value: "HARASSMENT", label: "Quấy rối, lạm dụng" },
  { value: "FAKE_PROFILE", label: "Hồ sơ giả mạo" },
  { value: "INAPPROPRIATE_CONTENT", label: "Nội dung không phù hợp" },
  { value: "SPAM", label: "Spam, quảng cáo" },
  { value: "OTHER", label: "Lý do khác" },
];

export const GENDER_LABEL = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
  UNDISCLOSED: "Không tiết lộ",
};

export const GOAL_LABEL = {
  FRIENDSHIP: "Kết bạn",
  DATING: "Hẹn hò",
  LONG_TERM: "Mối quan hệ lâu dài",
};

export { http };
