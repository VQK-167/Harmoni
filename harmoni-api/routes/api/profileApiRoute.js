const express = require("express");
const router = express.Router();

const profileApiController = require("../../controllers/api/profileApiController");

const {
    requireApiLogin,
    requireProfile
} = require("../../middlewares/authMiddleware");

// Tạo hồ sơ
router.post("/", requireApiLogin, profileApiController.createProfile);

// Xem hồ sơ của tôi
router.get(
    "/me",
    requireApiLogin,
    profileApiController.getMyProfile
);

// Cập nhật hồ sơ
router.put(
    "/me",
    requireProfile,
    profileApiController.updateProfile
);

//Cap nhat so thich
router.put("/me/interests", requireProfile, profileApiController.updateInterests);

module.exports = router;
