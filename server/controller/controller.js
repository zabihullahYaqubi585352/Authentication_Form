import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/models.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "../config/emailTemplate.js";
import { PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      massege: "Missing Ditails",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        massege: "user already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashPassword });
    await user.save();

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Use the user's email
      subject: "Test Email from Node.js",
      text: "This is a test email sent from Node.js using Nodemailer!",
    };
    // Send the email
    transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      massege: "user registered successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      massege: "user not registered successfully",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // send token or session here
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NOOD_ENV === "production",
      sameSite: process.env.NOOD_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      massege: "logged_out",
    });
  } catch (error) {
    return res.json({
      success: false,
      massege: error.massege,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    // If user is not found, return an error res
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    // console.log("User email:", user.email); // <-- You should print this too!

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "User already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use the user's email
      to: user.email, // Use the user's email
      subject: "Verify your account",
      // text: `Your verification OTP is ${otp}. It is valid for 24 hours.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};

export const verifyEmail = async (req, res) => {
  console.log("verifyEmail called", req);

  const userId = req.user.id; // Get from req.user
  const otp = req.body; // OTP comes from the body
  if (!userId || !otp) {
    return res.json({
      success: false,
      massege: "Missing details",
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        massege: "User not found",
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp.trim() != otp.otp.trim()) {
      return res.json({
        success: false,
        massege: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        massege: "OTP expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({
      success: true,
      massege: "Account verified successfully",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to verify account",
    });
  }
};

export const isAuth = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "User is authenticated",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message || "Failed to authenticate",
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const resetOtp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = resetOtp;
    user.resetOtpExpireAT = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password OTP",
      // text: `Your reset password OTP is ${resetOtp}. It is valid for 15 minutes.`,

      html: PASSWORD_RESET_TEMPLATE.replace("{{resetOtp}}", resetOtp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Reset OTP sent to your email",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to send reset OTP",
    });
  }
};
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Missing details",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.resetOtp !== otp ||
      user.resetOtpExpireAT < Date.now() ||
      user.resetOtp === ""
    ) {
      return res.json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpireAT = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};
