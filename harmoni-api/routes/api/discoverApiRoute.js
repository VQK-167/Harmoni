const express = require("express");
const router = express.Router();
const discoverApiController = require("../../controllers/api/discoverApiController");
// TODO: thêm requireProfile từ middlewares/authMiddleware (phải có hồ sơ mới được khám phá)

router.get("/", discoverApiController.getDiscoverList);

module.exports = router;
