const express = require("express");
const router = express.Router();
const { postGeneratePdf,postGenerateAnswerSheet  } = require("../Controllers/paperController");

router.post("/generate-pdf", postGeneratePdf);
router.post("/generate-answersheet", postGenerateAnswerSheet);

module.exports = router;