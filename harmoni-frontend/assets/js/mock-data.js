/**
 * mock-data.js
 * Dữ liệu mẫu (seed data) cho prototype Harmoni.
 * Cấu trúc được thiết kế để ánh xạ 1:1 với 9 bảng MySQL sẽ dùng ở backend:
 * users, profiles, interests, user_interests, likes, matches, messages, blocks, reports.
 * Toàn bộ dữ liệu này chỉ được dùng để SEED vào localStorage lần đầu (xem app.js -> HarmoniStore).
 */

(function (global) {
  "use strict";

  // Bảng "interests" (15 sở thích)
  var INTERESTS = [
    { id: 1, name: "Du lịch", icon: "bi-airplane" },
    { id: 2, name: "Âm nhạc", icon: "bi-music-note-beamed" },
    { id: 3, name: "Đọc sách", icon: "bi-book" },
    { id: 4, name: "Ẩm thực", icon: "bi-egg-fried" },
    { id: 5, name: "Thể thao", icon: "bi-trophy" },
    { id: 6, name: "Phim ảnh", icon: "bi-film" },
    { id: 7, name: "Nhiếp ảnh", icon: "bi-camera" },
    { id: 8, name: "Yoga", icon: "bi-person-arms-up" },
    { id: 9, name: "Nấu ăn", icon: "bi-cup-hot" },
    { id: 10, name: "Thú cưng", icon: "bi-heart" },
    { id: 11, name: "Nghệ thuật", icon: "bi-palette" },
    { id: 12, name: "Công nghệ", icon: "bi-cpu" },
    { id: 13, name: "Leo núi", icon: "bi-triangle" },
    { id: 14, name: "Cà phê", icon: "bi-cup-straw" },
    { id: 15, name: "Khiêu vũ", icon: "bi-stars" }
  ];

  // Bảng "users" — chỉ tài khoản có thể đăng nhập (demo). Các hồ sơ khám phá không cần đăng nhập được.
  var USERS = [
    { id: 1, email: "khang@harmoni.vn", password: "Harmoni@123", createdAt: "2026-01-10T08:00:00Z" }
  ];

  // Bảng "profiles" + user_interests (interestIds). profile.userId = 1 là người dùng hiện tại đang đăng nhập.
  var PROFILES = [
    {
      userId: 1,
      displayName: "Lê Minh Khang",
      dob: "1999-05-12",
      gender: "male",
      city: "Hà Nội",
      bio: "Mình thích những buổi chiều cà phê, một cuốn sách hay và những chuyến đi không có lịch trình cố định. Tìm một người đồng điệu để cùng khám phá cuộc sống chậm lại một chút.",
      purpose: "dating",
      interestIds: [1, 2, 3, 7, 14],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 2,
      displayName: "Nguyễn Minh Anh",
      dob: "2003-03-20",
      gender: "female",
      city: "Hà Nội",
      bio: "Thích du lịch, âm nhạc và khám phá những điều mới.",
      purpose: "dating",
      interestIds: [1, 2, 3, 4],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 3,
      displayName: "Đỗ Gia Hân",
      dob: "2002-07-02",
      gender: "female",
      city: "Hà Nội",
      bio: "Một người hướng nội thích sách, nhạc acoustic và cà phê sáng sớm. Đang tìm một mối quan hệ nghiêm túc và lâu dài.",
      purpose: "longterm",
      interestIds: [1, 2, 3, 7, 14, 9],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 4,
      displayName: "Phạm Thu Hà",
      dob: "2004-11-15",
      gender: "female",
      city: "TP. Hồ Chí Minh",
      bio: "Yêu động vật, yêu yoga, và luôn mang theo một ly cà phê mọi lúc mọi nơi.",
      purpose: "friend",
      interestIds: [2, 14, 8, 10],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 5,
      displayName: "Vũ Khánh Linh",
      dob: "2000-01-09",
      gender: "female",
      city: "Đà Nẵng",
      bio: "Mê leo núi, thích thể thao mạo hiểm và những món ăn lạ ở mọi vùng miền.",
      purpose: "friend",
      interestIds: [5, 13, 10, 4],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 6,
      displayName: "Trần Bảo Ngọc",
      dob: "2005-02-25",
      gender: "female",
      city: "Hà Nội",
      bio: "Thích đọc sách vào buổi tối, nghe nhạc indie và nấu những món ăn đơn giản cho người mình yêu thương.",
      purpose: "longterm",
      interestIds: [1, 3, 7, 14, 2, 9],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 7,
      displayName: "Hoàng Thảo Vy",
      dob: "2001-09-30",
      gender: "female",
      city: "TP. Hồ Chí Minh",
      bio: "Hay cày phim cuối tuần, thích nấu ăn và khiêu vũ khi vui.",
      purpose: "dating",
      interestIds: [6, 9, 4, 15],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 8,
      displayName: "Ngô Thanh Tùng",
      dob: "1998-04-18",
      gender: "male",
      city: "Hà Nội",
      bio: "Đam mê công nghệ, thích thể thao và những cuộc leo núi dài ngày.",
      purpose: "friend",
      interestIds: [5, 12, 13],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 9,
      displayName: "Bùi Quỳnh Chi",
      dob: "2002-12-05",
      gender: "female",
      city: "Hải Phòng",
      bio: "Thích chụp ảnh đường phố, nghe nhạc và đi du lịch một mình để tìm cảm hứng nghệ thuật.",
      purpose: "dating",
      interestIds: [1, 7, 2, 11],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 10,
      displayName: "Lý Gia Bảo",
      dob: "1999-06-22",
      gender: "male",
      city: "TP. Hồ Chí Minh",
      bio: "Làm công nghệ, rảnh thì chơi thể thao và chăm sóc mấy bé thú cưng ở nhà.",
      purpose: "friend",
      interestIds: [12, 5, 10],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 11,
      displayName: "Đặng Minh Thư",
      dob: "2003-08-14",
      gender: "female",
      city: "Đà Nẵng",
      bio: "Thích khám phá ẩm thực vùng miền, thỉnh thoảng vào bếp nấu món mới và khiêu vũ giải trí.",
      purpose: "dating",
      interestIds: [1, 4, 9, 15],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 12,
      displayName: "Phan Đức Anh",
      dob: "2000-10-03",
      gender: "male",
      city: "Cần Thơ",
      bio: "Thích xách máy ảnh đi du lịch, nghe nhạc trên đường và leo núi vào mỗi kỳ nghỉ dài.",
      purpose: "longterm",
      interestIds: [1, 2, 7, 13],
      avatar: "assets/images/default-avatar.svg"
    },
    {
      userId: 13,
      displayName: "Tạ Yến Nhi",
      dob: "2004-02-28",
      gender: "female",
      city: "Hà Nội",
      bio: "Mọt sách, nghiện cà phê và luôn có một playlist nhạc cho mọi tâm trạng.",
      purpose: "dating",
      interestIds: [3, 14, 2, 1, 9],
      avatar: "assets/images/default-avatar.svg"
    }
  ];

  // Bảng "likes" — action: 'like' | 'pass'
  var LIKES = [
    // Người dùng hiện tại (1) đã Like và đã Match với 3 và 6
    { id: 1, fromUserId: 1, toUserId: 3, action: "like", createdAt: "2026-02-01T10:00:00Z" },
    { id: 2, fromUserId: 3, toUserId: 1, action: "like", createdAt: "2026-02-01T10:05:00Z" },
    { id: 3, fromUserId: 1, toUserId: 6, action: "like", createdAt: "2026-02-03T09:00:00Z" },
    { id: 4, fromUserId: 6, toUserId: 1, action: "like", createdAt: "2026-02-03T09:12:00Z" },

    // Người dùng hiện tại đã Pass với 8 và 11 -> không hiển thị lại ở Khám phá
    { id: 5, fromUserId: 1, toUserId: 8, action: "pass", createdAt: "2026-02-04T11:00:00Z" },
    { id: 6, fromUserId: 1, toUserId: 11, action: "pass", createdAt: "2026-02-04T11:02:00Z" },

    // Phạm Thu Hà (4) đã Like trước người dùng hiện tại nhưng chưa được Like lại
    // -> dùng để demo Match hai chiều ngay khi người dùng hiện tại Like lại trong Khám phá
    { id: 7, fromUserId: 4, toUserId: 1, action: "like", createdAt: "2026-02-05T14:00:00Z" }
  ];

  // Bảng "matches"
  var MATCHES = [
    { id: 1, userIds: [1, 3], matchedAt: "2026-02-01T10:05:00Z", isActive: true },
    { id: 2, userIds: [1, 6], matchedAt: "2026-02-03T09:12:00Z", isActive: true }
  ];

  // Bảng "messages"
  var MESSAGES = [
    { id: 1, matchId: 1, senderId: 3, text: "Chào Khang, mình thấy hai đứa có nhiều sở thích chung quá 😄", createdAt: "2026-02-01T10:10:00Z" },
    { id: 2, matchId: 1, senderId: 1, text: "Đúng vậy, mình cũng thấy vậy! Hân có hay đọc sách vào buổi tối không?", createdAt: "2026-02-01T10:12:00Z" },
    { id: 3, matchId: 1, senderId: 3, text: "Có, tối nào mình cũng đọc một chút trước khi ngủ. Khang thích đọc loại sách gì?", createdAt: "2026-02-01T10:15:00Z" },

    { id: 4, matchId: 2, senderId: 1, text: "Chào Ngọc, rất vui vì mình đã match nhé!", createdAt: "2026-02-03T09:20:00Z" },
    { id: 5, matchId: 2, senderId: 6, text: "Chào Khang, mình cũng vậy! Cuối tuần này có dự định gì chưa?", createdAt: "2026-02-03T09:25:00Z" }
  ];

  // Bảng "blocks" — người dùng hiện tại đã chặn Lý Gia Bảo (10)
  var BLOCKS = [
    { id: 1, blockerId: 1, blockedId: 10, createdAt: "2026-02-02T08:00:00Z" }
  ];

  // Bảng "reports" — chưa có báo cáo nào khi khởi tạo
  var REPORTS = [];

  var REPORT_REASONS = [
    { value: "harassment", label: "Quấy rối" },
    { value: "fake", label: "Giả mạo tài khoản" },
    { value: "inappropriate", label: "Nội dung không phù hợp" },
    { value: "other", label: "Khác" }
  ];

  var PURPOSE_LABELS = {
    friend: "Kết bạn",
    dating: "Hẹn hò",
    longterm: "Tìm mối quan hệ lâu dài"
  };

  var GENDER_LABELS = {
    male: "Nam",
    female: "Nữ",
    other: "Khác"
  };

  global.HarmoniMock = {
    INTERESTS: INTERESTS,
    USERS: USERS,
    PROFILES: PROFILES,
    LIKES: LIKES,
    MATCHES: MATCHES,
    MESSAGES: MESSAGES,
    BLOCKS: BLOCKS,
    REPORTS: REPORTS,
    REPORT_REASONS: REPORT_REASONS,
    PURPOSE_LABELS: PURPOSE_LABELS,
    GENDER_LABELS: GENDER_LABELS
  };
})(window);
