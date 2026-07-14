require("dotenv").config();
const express = require("express");
const connectDB = require("./Config/mongoDB");
const router = require("./Routes/generateQuestionRouter");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});