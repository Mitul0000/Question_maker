const mongoose = require("mongoose");

const MongoDBConnect = mongoose
  .connect(
    "mongodb+srv://root:Mitul00%40@test.wp38ax2.mongodb.net/Question_generator?appName=Test",
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = MongoDBConnect;
