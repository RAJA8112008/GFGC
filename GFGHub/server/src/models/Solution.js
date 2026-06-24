import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        repositoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
        },

        problemName: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
        },

        language: String,

        topic: [String],

        code: String,

        problemUrl: String,

        githubCommitUrl: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Solution",
    solutionSchema
);