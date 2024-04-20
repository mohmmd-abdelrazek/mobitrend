import { Request, Response } from "express";
import UserModel from "../models/UserModel"; // Assuming the Mongoose model is exported from here

export const getUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId).select("id name email");
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
