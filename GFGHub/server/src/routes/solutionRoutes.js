import express from "express";
import Solution from "../models/Solution.js";
import Repository from "../models/Repository.js";

import { protect } from "../middleware/auth.js";

import { getOctokitForUser } from "../utils/githubClient.js";

import { commitFile } from "../services/commitService.js";

import { createFolderStructure } from "../services/folderStructureService.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
    const solutions = await Solution.find({
        userId: req.user._id,
    });

    res.json(solutions);
});

router.post("/", async (req, res) => {
    try {
        const {
            repositoryId,
            problemName,
            difficulty,
            language,
            topic,
            code,
            problemUrl,
        } = req.body;

        if (!repositoryId) {
            return res.status(400).json({
                success: false,
                message:
                    "Repository is required",
            });
        }

        const repo =
            await Repository.findById(
                repositoryId
            );

        if (!repo) {
            return res.status(404).json({
                success: false,
                message:
                    "Repository not found",
            });
        }
        const octokit =
            await getOctokitForUser(req.user._id);

        const folder =
            createFolderStructure(difficulty);

        const extensionMap = {
            cpp: "cpp",
            javascript: "js",
            python: "py",
            java: "java",
        };

        const ext =
            extensionMap[language] || "txt";

        const filePath =
            `${folder}/${problemName.replace(/\s+/g, "_")}.${ext}`;

        const commit =
            await commitFile(
                octokit,
                req.user.username,
                repo.repoName,
                filePath,
                code,
                `Add ${problemName}`
            );

        const solution =
            await Solution.create({
                userId: req.user._id,
                repositoryId,
                problemName,
                difficulty,
                language,
                topic,
                code,
                problemUrl,
                githubCommitUrl: commit.html_url,
            });

        res.status(201).json({
            success: true,
            solution,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;