const express = require("express");
const router = express.Router();
const { generateQuestion } = require("../Controllers/generateQuestionController");

router.post("/generate-question", generateQuestion);

module.exports = router;