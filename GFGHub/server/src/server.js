import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gfghub";

console.log("Starting server...");
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
console.log("SERVER_URL:", process.env.SERVER_URL || `http://localhost:${PORT}`);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT} (without database)`);
    });
  });