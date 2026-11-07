const express = require("express");
const router = express.Router();
const blockApiController = require("../../controllers/api/blockApiController");
// TODO: thêm requireApiLogin từ middlewares/authMiddleware

router.post("/", blockApiController.blockUser);
router.get("/", blockApiController.getBlocks);
router.delete("/:userId", blockApiController.unblockUser);

module.exports = router;
