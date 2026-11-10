const express = require("express");
const router = express.Router();
const reportApiController = require("../../controllers/api/reportApiController");
const { requireProfile } = require("../../middlewares/authMiddleware");

//bao cao nguoi khac chi co nghia khi da co ho so
router.post("/", requireProfile, reportApiController.reportUser);

module.exports = router;
