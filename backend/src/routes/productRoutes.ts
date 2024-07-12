import express from "express";
import * as productController from "../controllers/productController";
import { isAuthenticated } from "../middleware/middleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/:productSlug", productController.getProductBySlug);

router.post("/", isAuthenticated, productController.createProduct);

router.put("/:productSlug", isAuthenticated, productController.updateProduct);

router.delete("/:productSlug", isAuthenticated, productController.deleteProduct);

router.get("/:productSlug/images", productController.getProductImages);

router.delete("/images/:imageUrl", productController.deleteProductImage);

router.post(
  "/:id/upload-images",
  upload.array("images"),
  productController.uploadImages
);

export default router;
