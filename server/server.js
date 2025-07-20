import express from "express";
import session from "express-session"; // ✅ Required
import passport from "passport"; // ✅ Required
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";
import "./config/passport.js"; // 👈 configure strategies BEFORE using passport

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);

// ✅ SESSION must come before passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ✅ Initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.get("/", (req, res) => res.send("server run"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
