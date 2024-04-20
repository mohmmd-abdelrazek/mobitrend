import express from "express";
import * as orderController from "../controllers/orderController";
import { isAuthenticated, isAdmin } from "../middleware/middleware"; // Assume these are your authentication and admin middleware

const router = express.Router();

router.post("/", isAuthenticated, orderController.addOrder);

router.get("/:id", isAuthenticated, orderController.getOrderById);

router.put("/:id/pay", isAuthenticated, orderController.updateOrderToPaid);

router.put("/:id/deliver", isAdmin, orderController.updateOrderToDelivered);

router.get("/myorders", isAuthenticated, orderController.getMyOrders);

router.get("/", isAdmin, orderController.getAllOrders);

export default router;
