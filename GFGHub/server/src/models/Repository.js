import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        repoName: {
            type: String,
            required: true,
        },

        repoUrl: String,

        githubRepoId: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Repository",
    repositorySchema
);