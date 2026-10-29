-- Harmoni - thiết kế 9 bảng nghiệp vụ (theo bản chốt chức năng của nhóm)
-- Chạy file này để tạo database trước khi code model.

CREATE DATABASE IF NOT EXISTS harmoni CHARACTER SET utf8mb4;
USE harmoni;

-- 1. users: quản lý tài khoản đăng nhập (AUTH-01, AUTH-02, AUTH-03)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. profiles: hồ sơ cá nhân (PRO-01..04, SAF-04 giới hạn tuổi dựa vào birth_date)
CREATE TABLE profiles (
  user_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
  city VARCHAR(100) NOT NULL,
  bio TEXT,
  purpose ENUM('FRIEND', 'DATING', 'LONG_TERM') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. interests: danh mục sở thích (INT-01)
CREATE TABLE interests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. user_interests: sở thích của từng người dùng (INT-02, INT-03)
CREATE TABLE user_interests (
  user_id INT NOT NULL,
  interest_id INT NOT NULL,
  PRIMARY KEY (user_id, interest_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

-- 5. likes: lưu Like/Pass (LIKE-01..03)
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  action ENUM('LIKE', 'PASS') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_sender_receiver (sender_id, receiver_id),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. matches: các cặp ghép đôi (MAT-01..04)
CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  status ENUM('ACTIVE', 'UNMATCHED') NOT NULL DEFAULT 'ACTIVE',
  matched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_pair (user1_id, user2_id),
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. messages: tin nhắn trong 1 match (MSG-01..04)
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  sender_id INT NOT NULL,
  content VARCHAR(1000) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. blocks: danh sách chặn (SAF-01, SAF-02)
CREATE TABLE blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_block_pair (blocker_id, blocked_id),
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. reports: báo cáo vi phạm (SAF-03)
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,
  target_user_id INT NOT NULL,
  reason VARCHAR(100) NOT NULL,
  detail TEXT,
  status ENUM('PENDING', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO (INT-01): seed vài dòng mẫu vào bảng interests (âm nhạc, thể thao, du lịch...)
