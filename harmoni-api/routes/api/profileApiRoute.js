const express = require("express");
const router = express.Router();
const profileApiController = require("../../controllers/api/profileApiController");
// TODO: thêm requireApiLogin (và requireProfile cho các route cần hồ sơ) từ middlewares/authMiddleware

router.post("/", profileApiController.createProfile);
router.get("/me", profileApiController.getMyProfile);
router.put("/me", profileApiController.updateProfile);
router.put("/me/interests", profileApiController.updateInterests);

module.exports = router;
