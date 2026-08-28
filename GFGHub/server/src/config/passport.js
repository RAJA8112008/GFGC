import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const serverUrl = process.env.SERVER_URL || "http://localhost:5001";

console.log("PASSPORT CONFIG");
console.log("GITHUB_CLIENT_ID:", clientID);
console.log("GITHUB_CLIENT_SECRET exists:", !!clientSecret);
console.log("CALLBACK URL:", `${serverUrl}/api/auth/github/callback`);

if (clientID && clientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${serverUrl}/api/auth/github/callback`,
        scope: ["repo", "read:user", "user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

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
} else {
  console.warn(
    "GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in server/.env"
  );
}

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
