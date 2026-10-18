const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const { requireLogin } = require("../middlewares/authMiddleware");

router.get("/", requireLogin, profileController.show);
router.get("/edit", requireLogin, profileController.edit);
router.post("/edit", requireLogin, profileController.update);

module.exports = router;
