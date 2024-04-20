import { Request, Response } from "express";
import OrderModel from "../models/OrderModel";

// Place a new order
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

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  }

  try {
    const order = new OrderModel({
      user: req.user?._id, // Assuming req.user is populated by your authentication middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
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
  try {
    const orders = await OrderModel.find({ user: req.user?._id });
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
