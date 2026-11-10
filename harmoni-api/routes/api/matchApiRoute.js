const express = require("express");
const router = express.Router();
const matchApiController = require("../../controllers/api/matchApiController");
const { requireProfile } = require("../../middlewares/authMiddleware");

// Lay danh sach match dang ACTIVE cua user hien tai.
router.get("/", requireProfile, matchApiController.getMatches);

// Huy match, chi thanh vien cua match moi duoc phep huy.
router.patch("/:id/unmatch", requireProfile, matchApiController.unmatch);

// Cac API tin nhan se dung middleware nay khi phan Messaging duoc lam.
router.get("/:id/messages", requireProfile, matchApiController.getMessages);
router.post("/:id/messages", requireProfile, matchApiController.sendMessage);

module.exports = router;
