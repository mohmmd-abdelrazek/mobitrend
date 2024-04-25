import { Request, Response } from "express";
import DeliveryModel from "../models/DeliveryModel";

export class DeliveryController {
  // Create a new delivery record
  static async createDelivery(req: Request, res: Response): Promise<void> {
    const { order, trackingNumber, shippingMethod, estimatedDeliveryDate } =
      req.body;
    try {
      const newDelivery = await DeliveryModel.create({
        order,
        trackingNumber,
        shippingMethod,
        status: "pending", // Default status
        estimatedDeliveryDate,
      });
      res.status(201).json(newDelivery);
    } catch (error) {
      res.status(500).json({ message: "Failed to create delivery", error });
    }
  }

  // Update delivery status
  static async updateDeliveryStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const { deliveryId } = req.params;
    const { status } = req.body;
    try {
      const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
        deliveryId,
        { status },
        { new: true }
      );
      if (!updatedDelivery) {
        res.status(404).json({ message: "Delivery not found" });
        return;
      }
      res.json(updatedDelivery);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update delivery status", error });
    }
  }

  // Get delivery information by ID
  static async getDeliveryById(req: Request, res: Response): Promise<void> {
    const { deliveryId } = req.params;
    try {
      const delivery = await DeliveryModel.findById(deliveryId).populate(
        "order shippingMethod"
      );
      if (!delivery) {
        res.status(404).json({ message: "Delivery not found" });
        return;
      }
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve delivery", error });
    }
  }
}

export default DeliveryController;
