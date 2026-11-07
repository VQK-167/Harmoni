const express = require("express");
const router = express.Router();
const likeApiController = require("../../controllers/api/likeApiController");
// TODO: thêm requireProfile từ middlewares/authMiddleware

router.post("/", likeApiController.sendLike);

module.exports = router;
