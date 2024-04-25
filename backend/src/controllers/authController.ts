import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import UserModel from "../models/UserModel";
import VerificationCodeModel from "../models/VerificationCodeModel";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<void> => {
  // Create a test account on Ethereal (only needed once)
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter using the Ethereal test account
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // Ethereal username
      pass: testAccount.pass, // Ethereal password
    },
  });

  // Define email options
  const mailOptions = {
    from: '"Your Service Name" <your_service_email@example.com>', // sender address
    to: email, // list of receivers
    subject: "Verification Code", // Subject line
    text: `Your verification code is: ${verificationCode}`, // plain text body
    html: `<b>Your verification code is: ${verificationCode}</b>`, // HTML body content
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000); // Code expires in 10 minutes

  await VerificationCodeModel.findOneAndUpdate(
    { email },
    { email, code: verificationCode, expires_at: expiresAt },
    { upsert: true, new: true }
  );

  sendVerificationEmail(email, verificationCode);

  res.status(200).json({ message: "Verification code sent." });
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const result = await VerificationCodeModel.findOne({
    email,
    code,
    expires_at: { $gt: new Date() },
  });

  if (!result) {
    return res.status(400).json({ error: "Invalid or expired code." });
  }
  res.status(200).json({ message: "Verification code correct." });
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already in use." });
  }

  const saltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS || "12",
    10
  );
  const hashedPassword: string = await bcrypt.hash(password, saltRounds);

  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Signup successful",
    success: true,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export const login = (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({ message: "Login successful",success:true, user: req.user });
  } else {
    res.status(401).json({ error: "Login failed" });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.status(200).json({ success: true, message: "Logout successful" });
  });
};

export const status = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ isAuthenticated: req.isAuthenticated(), isAdmin: req.isAuthenticated() && req.user?.role === "admin" });
};

export const googleCallback = passport.authenticate("google");
