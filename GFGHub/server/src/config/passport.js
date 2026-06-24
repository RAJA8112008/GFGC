import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
console.log(
    "Callback URL:",
    `${process.env.SERVER_URL}/api/auth/github/callback`
);
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
            scope: ["repo", "read:user", "user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    githubId: profile.id,
                });

                if (!user) {
                    user = await User.create({
                        githubId: profile.id,
                        username: profile.username,
                        email: profile.emails?.[0]?.value,
                        avatarUrl: profile.photos?.[0]?.value,
                        githubToken: accessToken,
                    });
                } else {
                    user.githubToken = accessToken;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});