// api.js — tầng gọi API dùng chung, mọi trang (pages/) chỉ gọi qua các hàm ở đây.
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // bắt buộc để trình duyệt gửi/nhận cookie session
});

// TODO: viết chung 1 hàm normalizeError(e) để pages luôn đọc được err.message, err.status

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
// TODO: discover(limit)
// TODO: getUserDetail(id)

// --- Like/Pass & Match (LIKE-01..03, MAT-01..04) ---
// TODO: sendLike({ receiverId, action })
// TODO: getMatches()
// TODO: unmatch(matchId)

// --- Nhắn tin (MSG-01..04) ---
// TODO: getMessages(matchId, afterId)
// TODO: sendMessage(matchId, content)

// --- An toàn (SAF-01..04) ---
// TODO: blockUser(userId)
// TODO: getBlocks()
// TODO: unblockUser(userId)
// TODO: reportUser({ targetUserId, reason, detail })

export { http };
