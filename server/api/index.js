const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = require("../app");

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  encodeURIComponent(process.env.DATABASE_PASSWORD || "")
);

if (!mongoose.connection.readyState) {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Export the app for Vercel
module.exports = app;
