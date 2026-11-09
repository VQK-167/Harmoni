const express = require("express");
const router = express.Router();

// Import controller de route chuyen request den ham xu ly nghiep vu.
const likeApiController = require("../../controllers/api/likeApiController");

// Middleware kiem tra user da dang nhap va da co profile.
const { requireProfile } = require("../../middlewares/authMiddleware");

// app.js da dung app.use("/api/likes", likeApiRoute),
// nen endpoint day du se la POST /api/likes.
// requireProfile chay truoc sendLike.
router.post("/", requireProfile, likeApiController.sendLike);

// Export router de app.js su dung.
module.exports = router;
