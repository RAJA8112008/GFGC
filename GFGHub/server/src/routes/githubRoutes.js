import express from "express";
import { protect } from "../middleware/auth.js";
import Repository from "../models/Repository.js";
import { getOctokitForUser } from "../utils/githubClient.js";

const router = express.Router();

router.use(protect);

router.get("/repos", async (req, res) => {
  try {
    const repos = await Repository.find({ userId: req.user._id }).sort({
      createdAt: -1
    });

    res.json(repos);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/repos", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Repository name is required"
      });
    }

    const octokit = await getOctokitForUser(req.user._id);

    const { data } =
      await octokit.rest.repos.createForAuthenticatedUser({
        name,
        private: false
      });

    const repo = await Repository.create({
      userId: req.user._id,
      repoName: data.name,
      repoUrl: data.html_url,
      githubRepoId: String(data.id)
    });

    res.status(201).json(repo);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/external-repos", async (req, res) => {
  try {
    const octokit = await getOctokitForUser(req.user._id);

    // Fetch up to 100 repositories the user has access to
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated"
    });

    // We only need basic details
    const repos = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      html_url: repo.html_url,
      updated_at: repo.updated_at
    }));

    res.json(repos);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/link", async (req, res) => {
  try {
    const { repoName, repoUrl, githubRepoId } = req.body;

    if (!repoName || !repoUrl || !githubRepoId) {
      return res.status(400).json({
        success: false,
        message: "Repository details (repoName, repoUrl, githubRepoId) are required"
      });
    }

    // Check if it's already linked
    const existing = await Repository.findOne({ 
      userId: req.user._id, 
      githubRepoId: String(githubRepoId) 
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Repository is already linked"
      });
    }

    const repo = await Repository.create({
      userId: req.user._id,
      repoName,
      repoUrl,
      githubRepoId: String(githubRepoId)
    });

    res.status(201).json(repo);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;