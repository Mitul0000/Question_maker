const express = require("express");
const router = express.Router();
const { postGeneratePdf } = require("../Controllers/paperController");

router.post("/generate-pdf", postGeneratePdf);

module.exports = router;