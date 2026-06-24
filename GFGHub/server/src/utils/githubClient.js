import { Octokit } from "octokit";
import User from "../models/User.js";

export const getOctokitForUser = async (
    userId
) => {
    const user = await User.findById(userId);

    return new Octokit({
        auth: user.githubToken,
    });
};