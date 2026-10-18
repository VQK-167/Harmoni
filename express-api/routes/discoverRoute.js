const express = require("express");
const router = express.Router();

const discoverController = require("../controllers/discoverController");
const { requireLogin } = require("../middlewares/authMiddleware");

router.get("/", requireLogin, discoverController.index);
router.post("/:id/like", requireLogin, discoverController.like);
router.post("/:id/pass", requireLogin, discoverController.pass);

module.exports = router;
