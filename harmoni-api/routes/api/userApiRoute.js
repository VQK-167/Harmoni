const express = require("express");
const router = express.Router();
const discoverApiController = require("../../controllers/api/discoverApiController");
// TODO: thêm requireProfile từ middlewares/authMiddleware

router.get("/:id", discoverApiController.getUserDetail);

module.exports = router;
