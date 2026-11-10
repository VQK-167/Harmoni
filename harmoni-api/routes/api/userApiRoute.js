const express = require("express");
const router = express.Router();
const discoverApiController = require("../../controllers/api/discoverApiController");
const { requireProfile } = require("../../middlewares/authMiddleware");

// Chi user da dang nhap va co profile moi duoc xem chi tiet user.
router.get("/:id", requireProfile, discoverApiController.getUserDetail);

module.exports = router;
