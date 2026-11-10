const pool = require("../../config/db");
const profileModel = require("../../models/profileModel");
const userInterestModel = require("../../models/userInterestModel");
const likeModel = require("../../models/likeModel");

// Tinh tuoi tu ngay sinh.
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// Tinh phan tram so thich chung theo cong thuc giao / hop.
function calculateSimilarity(myInterestIds, otherInterestIds) {
  const otherSet = new Set(otherInterestIds);
  const commonInterestIds = myInterestIds.filter((id) => otherSet.has(id));
  const union = new Set([...myInterestIds, ...otherInterestIds]);
  const similarity = union.size === 0
    ? 0
    : Math.round((commonInterestIds.length / union.size) * 100);

  return { similarity, commonInterestIds };
}

// Chuyen profile trong database thanh du lieu cong khai cho frontend.
function toPublicProfile(profile, interestIds, similarity, commonInterestIds) {
  return {
    userId: profile.user_id,
    displayName: profile.display_name,
    age: calculateAge(profile.date_of_birth),
    gender: profile.gender,
    city: profile.city,
    bio: profile.bio,
    connectionGoal: profile.connection_goal,
    avatarUrl: profile.avatar_url || null,
    interestIds,
    similarity,
    commonInterestIds
  };
}

// Lay cac profile khac, user dang ACTIVE va khong bi block hai chieu.
async function findCandidates(userId) {
  const SQL = `
    SELECT p.*
    FROM profiles p
    INNER JOIN users u ON u.id = p.user_id
    WHERE p.user_id <> ?
      AND u.status = 'ACTIVE'
      AND NOT EXISTS (
        SELECT 1
        FROM blocks b
        WHERE (b.blocker_id = ? AND b.blocked_id = p.user_id)
           OR (b.blocker_id = p.user_id AND b.blocked_id = ?)
      )
  `;

  const [rows] = await pool.execute(SQL, [userId, userId, userId]);
  return rows;
}

// Lay danh sach nguoi de xuat cho user hien tai.
async function getDiscoverList(req, res) {
  try {
    const userId = req.session.userId;
    const limitValue = Number(req.query.limit) || 20;
    const limit = Math.min(Math.max(limitValue, 1), 100);
    const myInterestIds = await userInterestModel.findByUserId(userId);
    const excludedIds = await likeModel.findLikedReceiverIds(userId);
    const excludedSet = new Set(excludedIds);
    const candidates = await findCandidates(userId);
    const candidateIds = candidates.map((profile) => profile.user_id);
    const interestMap = await userInterestModel.findByUserIds(candidateIds);
    const result = [];

    for (const profile of candidates) {
      // Bo qua nguoi minh da LIKE hoac PASS.
      if (excludedSet.has(profile.user_id)) {
        continue;
      }

      const interestIds = interestMap.get(profile.user_id) || [];
      const { similarity, commonInterestIds } = calculateSimilarity(
        myInterestIds,
        interestIds
      );

      result.push(
        toPublicProfile(
          profile,
          interestIds,
          similarity,
          commonInterestIds
        )
      );
    }

    result.sort((first, second) => second.similarity - first.similarity);

    return res.status(200).json({
      success: true,
      message: "Lay danh sach de xuat thanh cong",
      data: result.slice(0, limit)
    });
  } catch (error) {
    console.error("Loi lay danh sach Discovery:", error);

    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

// Lay chi tiet mot user va tinh muc do tuong dong.
async function getUserDetail(req, res) {
  try {
    const userId = req.session.userId;
    const targetId = Number(req.params.id);

    if (!Number.isInteger(targetId) || targetId <= 0 || targetId === userId) {
      return res.status(400).json({
        success: false,
        message: "ID user khong hop le",
        data: null
      });
    }

    const targetProfile = await profileModel.findByUserId(targetId);

    if (!targetProfile) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay profile",
        data: null
      });
    }

    const blockedRows = await pool.execute(
      `
        SELECT 1
        FROM blocks
        WHERE (blocker_id = ? AND blocked_id = ?)
           OR (blocker_id = ? AND blocked_id = ?)
        LIMIT 1
      `,
      [userId, targetId, targetId, userId]
    );
    const isBlocked = blockedRows[0].length > 0;
    const myInterestIds = await userInterestModel.findByUserId(userId);
    const targetInterestIds = await userInterestModel.findByUserId(targetId);
    const myAction = await likeModel.findBySenderAndReceiver(userId, targetId);
    const { similarity, commonInterestIds } = calculateSimilarity(
      myInterestIds,
      targetInterestIds
    );

    return res.status(200).json({
      success: true,
      message: "Lay chi tiet user thanh cong",
      data: {
        ...toPublicProfile(
          targetProfile,
          targetInterestIds,
          similarity,
          commonInterestIds
        ),
        myAction: myAction ? myAction.action : null,
        isBlocked
      }
    });
  } catch (error) {
    console.error("Loi lay chi tiet user:", error);

    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

module.exports = {
  getDiscoverList,
  getUserDetail
};
