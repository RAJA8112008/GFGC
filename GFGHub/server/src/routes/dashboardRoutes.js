import express from "express";
import Solution from "../models/Solution.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/stats", async (req, res) => {
    try {
        const total =
            await Solution.countDocuments({
                userId: req.user._id,
            });

        const easy =
            await Solution.countDocuments({
                userId: req.user._id,
                difficulty: "Easy",
            });

        const medium =
            await Solution.countDocuments({
                userId: req.user._id,
                difficulty: "Medium",
            });

        const hard =
            await Solution.countDocuments({
                userId: req.user._id,
                difficulty: "Hard",
            });

        res.json({
            total,
            easy,
            medium,
            hard,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;