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
  try {
    const solutions = await Solution.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(solutions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
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
      problemUrl
    } = req.body;

    if (!repositoryId) {
      return res.status(400).json({
        success: false,
        message: "Repository is required"
      });
    }

    if (!problemName || !code) {
      return res.status(400).json({
        success: false,
        message: "Problem name and code are required"
      });
    }

    const repo = await Repository.findOne({
      _id: repositoryId,
      userId: req.user._id
    });

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Repository not found"
      });
    }

    const octokit = await getOctokitForUser(req.user._id);
    const folder = createFolderStructure(difficulty || "Easy");

    const extensionMap = {
      cpp: "cpp",
      javascript: "js",
      python: "py",
      java: "java"
    };

    const ext = extensionMap[language] || "txt";

    const safeProblemName = problemName
      .replace(/[<>:"/\\|?*]+/g, "")
      .replace(/\s+/g, "_");

    const filePath = `${folder}/${safeProblemName}.${ext}`;

    const urlParts = repo.repoUrl.split("/");
    const repoOwner = urlParts[urlParts.length - 2];

    const commit = await commitFile(
      octokit,
      repoOwner,
      repo.repoName,
      filePath,
      code,
      `Add ${problemName}`
    );

    const solution = await Solution.create({
      userId: req.user._id,
      repositoryId,
      problemName,
      difficulty: difficulty || "Easy",
      language: language || "cpp",
      topic: Array.isArray(topic) ? topic : [topic || "GeeksForGeeks"],
      code,
      problemUrl,
      githubCommitUrl: commit.html_url
    });

    res.status(201).json({
      success: true,
      solution
    });
  } catch (error) {
    console.error("Solution push error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;