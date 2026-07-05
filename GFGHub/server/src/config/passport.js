import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

console.log("PASSPORT CONFIG");
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CLIENT_SECRET exists:", !!process.env.GITHUB_CLIENT_SECRET);
console.log(
  "CALLBACK URL:",
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

    try{

        console.log("ACCESS TOKEN:",accessToken);
        console.log("PROFILE:",profile);

        let user = await User.findOne({
            githubId:profile.id
        });

        console.log("Existing User:",user);

        if(!user){

            user = await User.create({

                githubId:profile.id,

                username:profile.username,

                email:profile.emails?.[0]?.value,

                avatarUrl:profile.photos?.[0]?.value,

                githubToken:accessToken

            });

            console.log("New User Created");

        }else{

            user.githubToken=accessToken;

            await user.save();

            console.log("Existing User Updated");

        }

        return done(null,user);

    }

    catch(error){

        console.log("PASSPORT ERROR");

        console.log(error);

        return done(error,null);

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