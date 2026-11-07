const express = require("express");
const router = express.Router();
const matchApiController = require("../../controllers/api/matchApiController");
// TODO: thêm requireProfile từ middlewares/authMiddleware

router.get("/", matchApiController.getMatches);
router.patch("/:id/unmatch", matchApiController.unmatch);

// Tin nhắn lồng trong match (MSG-01..04)
router.get("/:id/messages", matchApiController.getMessages);
router.post("/:id/messages", matchApiController.sendMessage);

module.exports = router;
