import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

/* -----------------------------------------
   Middleware
------------------------------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------------
   CORS Configuration
------------------------------------------ */
const allowedOrigins = [
  "http://localhost:3000",
  "https://techorbitra.com",
  "https://www.techorbitra.com",
  process.env.FRONT_URI?.replace(/\/$/, ""),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, cron jobs
      if (!origin) return callback(null, true);

      // Allow exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview domains
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // ❌ DO NOT throw error → return false
      return callback(null, false);
    },
    credentials: true,
  })
);

/* -----------------------------------------
   Database Connection
------------------------------------------ */
await connectDB();

/* -----------------------------------------
   Routes
------------------------------------------ */
app.use("/api/admin", adminRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.get("/", (req, res) => {
  res.status(200).send("🚀 API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* -----------------------------------------
   Global Error Handler (Optional but Recommended)
------------------------------------------ */
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
