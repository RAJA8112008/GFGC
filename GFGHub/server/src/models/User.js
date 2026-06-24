import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true,
        },

        username: String,

        email: String,

        avatarUrl: String,

        githubToken: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);