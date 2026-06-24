import express from "express";
import passport from "passport";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { generateToken } from "../utils/generateJWT.js";

const router = express.Router();

router.get(
    "/github",
    passport.authenticate("github")
);

router.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
    }),
    async (req, res) => {
        try {
            const token = generateToken(req.user._id);

            console.log(
                "CLIENT_ORIGIN =",
                process.env.CLIENT_ORIGIN
            );

            console.log(
                "Redirect URL =",
                `${process.env.CLIENT_ORIGIN}/auth-success?token=${token}`
            );

            res.redirect(
                `${process.env.CLIENT_ORIGIN}/auth-success?token=${token}`
            );
        } catch (error) {
            console.error(
                "OAuth Callback Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

router.get(
    "/me",
    protect,
    async (req, res) => {
        try {
            res.json(req.user);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

export default router;