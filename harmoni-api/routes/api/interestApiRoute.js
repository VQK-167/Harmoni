const express = require("express");
const router = express.Router();
const interestApiController = require("../../controllers/api/interestApiController");
const {requireApiLogin} = require("../../middlewares/authMiddleware");

router.get("/",requireApiLogin, interestApiController.getInterests);

module.exports = router;
