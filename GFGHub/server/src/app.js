import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";

import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import "./config/passport.js";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      console.log("Origin:", origin);

      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.CLIENT_ORIGIN,
        process.env.FRONTEND_URL,
        "https://gfgc-tawny.vercel.app",
        "https://www.geeksforgeeks.org",
      ];

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("chrome-extension://")
      ) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GFGHub Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;