const express = require("express");
const router = express.Router();

// Import controller de lay ham sendLike
const likeApiController = require("../../controllers/api/likeApiController");

// Middleware kiem tra user da dang nhap va da co profile.
const { requireProfile } = require("../../middlewares/authMiddleware");

// Tao API post like or pass 
router.post("/", requireProfile, likeApiController.sendLike);

module.exports = router;
