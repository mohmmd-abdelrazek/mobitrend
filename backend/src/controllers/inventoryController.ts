import { Request, Response } from 'express';
import InventoryModel from '../models/InventoryModel';

export class InventoryController {
    
    static async addInventory(req: Request, res: Response): Promise<void> {
        const { product, warehouse, quantity, restockThreshold, supplier, restockQuantity } = req.body;
        try {
            const newInventory = await InventoryModel.create({
                product,
                warehouse,
                quantity,
                restockThreshold,
                supplier,
                restockQuantity,
                isInTransit: false
            });
            res.status(201).json(newInventory);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create inventory record', error });
        }
    }

    // Update inventory details
    static async updateInventory(req: Request, res: Response): Promise<void> {
        const { inventoryId } = req.params;
        const updateData = req.body;
        try {
            const updatedInventory = await InventoryModel.findByIdAndUpdate(
                inventoryId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedInventory) {
                res.status(404).json({ message: 'Inventory record not found' });
                return;
            }
            res.json(updatedInventory);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update inventory', error });
        }
    }

    // Retrieve inventory by product
    static async getInventoryByProduct(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        try {
            const inventory = await InventoryModel.find({ product: productId });
            if (!inventory) {
                res.status(404).json({ message: 'No inventory found for this product' });
                return;
            }
            res.json(inventory);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving inventory', error });
        }
    }

    // Retrieve all inventory records
    static async getAllInventory(req: Request, res: Response): Promise<void> {
        try {
            const inventoryList = await InventoryModel.find({});
            res.json(inventoryList);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve inventory', error });
        }
    }

    // Delete an inventory record
    static async deleteInventory(req: Request, res: Response): Promise<void> {
        const { inventoryId } = req.params;
        try {
            const deletedInventory = await InventoryModel.findByIdAndDelete(inventoryId);
            if (!deletedInventory) {
                res.status(404).json({ message: 'Inventory record not found' });
                return;
            }
            res.status(204).json({ message: 'Inventory deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete inventory', error });
        }
    }
}

export default InventoryController;
