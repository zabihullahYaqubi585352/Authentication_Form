// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as FacebookStrategy } from "passport-facebook";
import userModel from "../models/models.js"; // Adjust the path as necessary
import { Strategy as GitHubStrategy } from "passport-github2";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await userModel.findOne({ googleId: profile.id });
      if (!user) {
        user = await userModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          isAccountVerified: true,
        });
      }
      return done(null, user);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ githubId: profile.id });
        if (!user) {
          user = await userModel.create({
            name: profile.displayName || profile.username,
            email:
              profile.emails?.[0]?.value || `${profile.username}@github.com`,
            githubId: profile.id,
            isAccountVerified: true,
          });
        }
        return done(null, user); // ✅ send DB user, not raw profile
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});
