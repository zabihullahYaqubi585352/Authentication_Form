import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'smtp.gmail.com' for more control
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // App password (not your real password)
  },
  tls: {
    rejectUnauthorized: false, // <-- This line is important
  },
});

export default transporter;
