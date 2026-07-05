import express from "express";
import passport from "passport";
import { protect } from "../middleware/auth.js";
import { generateToken } from "../utils/generateJWT.js";

const router = express.Router();

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/github/failure",
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);

      res.redirect(
        `${process.env.CLIENT_ORIGIN}/auth-success?token=${token}`
      );
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