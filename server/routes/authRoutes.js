import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  isAuth,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controller/controller.js";
import userAuth from "../middleWare/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuth);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

// Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // ✅ Create JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "Lax", // Or "None" if you're using cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // ✅ Redirect
    res.redirect("http://localhost:5173/?loggedIn=google");
  }
);

// Facebook OAuth
// authRouter.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );
// authRouter.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "http://localhost:5173",
//     failureRedirect: "http://localhost:5173/login",
//   })
// );
authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/?loggedIn=github");
  }
);

export default authRouter;
