const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { requireLogin } = require("../middlewares/authMiddleware");

router.get("/", requireLogin, messageController.index);
router.get("/:id", requireLogin, messageController.show);
router.post("/:id", requireLogin, messageController.send);

module.exports = router;
