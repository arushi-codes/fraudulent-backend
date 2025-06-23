const express = require("express");
const router = express.Router();
const { analyzeMessage } = require("../controllers/analyzeController");

router.post("/analyze", analyzeMessage);

module.exports = router;
