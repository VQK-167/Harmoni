const express = require("express");
const router = express.Router();
const blockApiController = require("../../controllers/api/blockApiController");
const { requireProfile } = require("../../middlewares/authMiddleware");

// requireProfile: chan nguoi khac chi co nghia khi da co ho so
router.post("/", requireProfile, blockApiController.blockUser);
router.get("/", requireProfile, blockApiController.getBlocks);
router.delete("/:userId", requireProfile, blockApiController.unblockUser);

module.exports = router;
