const express = require("express");
const router = express.Router();
const interestApiController = require("../../controllers/api/interestApiController");

router.get("/", interestApiController.getInterests);

module.exports = router;
