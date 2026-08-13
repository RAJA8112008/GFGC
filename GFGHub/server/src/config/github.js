const serverUrl = process.env.SERVER_URL || "http://localhost:5001";
export const githubConfig = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${serverUrl}/api/auth/github/callback`
};
