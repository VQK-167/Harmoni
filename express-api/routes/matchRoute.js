const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const { requireLogin } = require("../middlewares/authMiddleware");

router.get("/", requireLogin, matchController.index);

module.exports = router;
