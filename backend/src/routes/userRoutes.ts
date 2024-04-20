import express from "express";
import * as userController from "../controllers/userController";
import { isAuthenticated } from "../middleware/middleware"; // Middleware to check if the user is authenticated

const router = express.Router();

router.get("/profile", isAuthenticated, userController.getUserProfile);

router.post(
  "/profile/update",
  isAuthenticated,
  userController.updateUserProfile
);

export default router;
