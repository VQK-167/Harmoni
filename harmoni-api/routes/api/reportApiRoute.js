const express = require("express");
const router = express.Router();
const reportApiController = require("../../controllers/api/reportApiController");
// TODO: thêm requireApiLogin từ middlewares/authMiddleware

router.post("/", reportApiController.reportUser);

module.exports = router;
