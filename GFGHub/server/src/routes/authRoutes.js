import express from "express";
import passport from "passport";
import { protect } from "../middleware/auth.js";
import { generateToken } from "../utils/generateJWT.js";

const router = express.Router();

const ensureGithubAuth = (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(503).json({
      success: false,
      message:
        "GitHub OAuth is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to server/.env",
    });
  }
  next();
};

router.get("/github", ensureGithubAuth, passport.authenticate("github"));

router.get(
  "/github/callback",
  ensureGithubAuth,
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/github/failure",
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);

      const clientOrigin =
        process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${clientOrigin}/auth-success?token=${token}`);
    } catch (error) {
      console.error("OAuth Callback Error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);




router.get("/github/failure", (req, res) => {
  res.status(500).json({
    success: false,
    message: "GitHub OAuth failed during access token exchange",
  });
});

router.get("/me", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;