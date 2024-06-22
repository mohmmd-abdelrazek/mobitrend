import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
// import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import shippingRoutes from "./routes/shippingRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import promotionRoutes from "./routes/promotionRoutes";

import connectDB from "./config/db";
import passport from "./config/passportConfig";
import { sessionMiddleware } from "./config/sessionConfig";
// import { requestLogger } from "./middleware/middleware";
import { handleStripeWebhook } from "./controllers/paymentController";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// });

// app.use(limiter);
// app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/promotion", promotionRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
