import express from "express";
import * as productController from "../controllers/productController";
import { isAuthenticated } from "../middleware/middleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post("/", isAuthenticated, productController.createProduct);

router.put("/:id", isAuthenticated, productController.updateProduct);

router.delete("/:id", isAuthenticated, productController.deleteProduct);

router.get("/:id/images", productController.getProductImages);

router.delete("/images/:imageUrl", productController.deleteProductImage);

router.post(
  "/:id/upload-images",
  upload.array("images"),
  productController.uploadImages
);

export default router;
