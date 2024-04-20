import express from "express";
import * as productController from "../controllers/productController";
import { isAuthenticated } from "../middleware/middleware";

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post("/", isAuthenticated, productController.createProduct);

router.put("/:id", isAuthenticated, productController.updateProduct);

router.delete("/:id", isAuthenticated, productController.deleteProduct);

export default router;
