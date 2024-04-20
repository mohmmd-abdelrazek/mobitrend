import { Request, Response } from 'express';
import ShippingModel from '../models/ShippingModel';

export class ShippingController {
    
    // Create a new shipping method
    static async createShippingMethod(req: Request, res: Response): Promise<void> {
        const { method, cost, region, estimatedDelivery, isActive } = req.body;
        try {
            const newShippingMethod = await ShippingModel.create({
                method,
                cost,
                region,
                estimatedDelivery,
                isActive
            });
            res.status(201).json(newShippingMethod);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create shipping method', error });
        }
    }

    // Update a shipping method
    static async updateShippingMethod(req: Request, res: Response): Promise<void> {
        const { shippingMethodId } = req.params;
        try {
            const updatedShippingMethod = await ShippingModel.findByIdAndUpdate(
                shippingMethodId,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedShippingMethod) {
                res.status(404).json({ message: 'Shipping method not found' });
                return;
            }
            res.json(updatedShippingMethod);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update shipping method', error });
        }
    }

    // Get all shipping methods
    static async getAllShippingMethods(req: Request, res: Response): Promise<void> {
        try {
            const shippingMethods = await ShippingModel.find({});
            res.json(shippingMethods);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve shipping methods', error });
        }
    }

}

export default ShippingController;
