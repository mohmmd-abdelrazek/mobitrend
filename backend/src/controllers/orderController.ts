import { Request, Response } from "express";
import OrderModel from "../models/OrderModel";
import CartModel from "../models/CartModel";
import ProductModel from "../models/ProductModel";

export const addOrder = async (req: Request, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    const order = new OrderModel({
      user: req.user?._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save({ session });

    // Update product stock
    for (const item of orderItems) {
      const product = await ProductModel.findById(item.product);

      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      if (product.inStock < item.qty) {
        throw new Error(`Not enough stock for product: ${item.product}`);
      }

      product.inStock -= item.qty;
      await product.save({ session });
    }

    // Clear the cart
    const userId = req.user?._id;
    await CartModel.findOneAndUpdate(
      { user: userId },
      {
        cartItems: [],
        itemsPrice: 0,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
    } else {
      res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order", error });
  }
};

// Update order to paid
export const updateOrderToPaid = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order to paid", error });
  }
};

// Update order to delivered
export const updateOrderToDelivered = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order to delivered", error });
  }
};

// Get all orders of a user
export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    console.log("User ID is not available.");
    res.status(400).json({ message: "User not authenticated" });
    return;
  }

  try {
    const orders = await OrderModel.find({ user: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders", error });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving all orders", error });
  }
};
