import dotenv from "dotenv";
import app from "./app.js";
import db from "./db/db.js";

export async function connectToDatabase() {
  dotenv.config();
  const PORT = process.env.PORT || 3002;
  try {
    await db.query("SELECT 1"); // Test DB
    console.log("✅ Database connection successful!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

// Actually call the function when this file is run directly
connectToDatabase();