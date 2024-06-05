import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import fs from "fs";
import { promisify } from "util";
import UserModel from "../models/UserModel";

const unlinkAsync = promisify(fs.unlink);

export const getUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId).select("id name email profile_picture_url createdAt");
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  const userId = req.user.id;

  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true } // return the updated object and run validation according to schema
    ).select("id name email");

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during profile update.");
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }

  const userId = req.user.id;

  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).send("No files were uploaded");
    }

    const file = (req.files as Express.Multer.File[])[0];

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: `users/${userId}/avatar`,
    });

    // Delete the local file after uploading
    await unlinkAsync(file.path);

    // Fetch the user from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user's profile picture URL
    user.profile_picture_url = uploadResult.secure_url;

    // Save the updated user back to the database
    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      data: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};

export const getAVatar = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  const userId = req.user.id;
  try {
    const result = await cloudinary.search
      .expression(`folder:users/${userId}/avatar`)
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();
    const avatar = result.resources.map(
      (resource: { secure_url: unknown }) => resource.secure_url
    )[0];
    res.status(200).json({ avatar });
  } catch (error) {
    console.error("Failed to fetch images:", error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};
