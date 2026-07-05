import express from "express";
import passport from "passport";
import { protect } from "../middleware/auth.js";
import { generateToken } from "../utils/generateJWT.js";

const router = express.Router();

router.get("/github", passport.authenticate("github"));

router.get("/github/callback", (req, res, next) => {

  passport.authenticate(
    "github",
    { session: false },
    async (err, user, info) => {

      console.log("========== GITHUB CALLBACK ==========");
      console.log("ERR:", err);
      console.log("USER:", user);
      console.log("INFO:", info);

      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          success:false,
          info
        });
      }

      try {

        const token = generateToken(user._id);

        return res.redirect(
          `${process.env.CLIENT_ORIGIN}/auth-success?token=${token}`
        );

      } catch(error){

        console.log(error);

        return res.status(500).json({
          success:false,
          message:error.message
        });

      }

    }

  )(req,res,next);

});
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