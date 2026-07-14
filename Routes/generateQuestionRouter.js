const express = require("express");
const router = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const upload = multer({ storage: multer.memoryStorage() });
const { postGenerateQuestion, postRegenerateQuestion, deleteSession } = require("../Controllers/generateController");

router.post("/generate", upload.array("files"), postGenerateQuestion);
router.post("/regenerate", postRegenerateQuestion);
router.delete("/session", deleteSession);

module.exports = router;