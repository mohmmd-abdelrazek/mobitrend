import express from "express";
import * as userController from "../controllers/userController";
import { isAuthenticated } from "../middleware/middleware"; // Middleware to check if the user is authenticated
import multer from "multer";
const upload = multer({dest:"uploads/"})
const router = express.Router();

router.get("/profile", isAuthenticated, userController.getUserProfile);

router.post(
  "/profile/update",
  isAuthenticated,
  userController.updateUserProfile
);

router.post("/upload-avatar", upload.array("avatar"), userController.uploadAvatar)
router.get("/avatar", isAuthenticated, userController.getAVatar)

export default router;