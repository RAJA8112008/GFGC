import { Octokit } from "octokit";
import User from "../models/User.js";

export const getOctokitForUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.githubToken) {
    throw new Error("GitHub token not found for user");
  }

  return new Octokit({
    auth: user.githubToken
  });
};