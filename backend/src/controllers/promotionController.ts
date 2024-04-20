import { Request, Response } from 'express';
import PromotionsModel from '../models/PromotionModel';

export class PromotionController {
    
    // Create a new promotion
    static async createPromotion(req: Request, res: Response): Promise<void> {
        const {
            name,
            description,
            discountType,
            discountValue,
            minimumPurchaseAmount,
            active,
            startDate,
            endDate,
            applicableProducts,
            applicableCategories,
            maxUsagePerUser,
            totalUsageLimit
        } = req.body;
        try {
            const newPromotion = await PromotionsModel.create({
                name,
                description,
                discountType,
                discountValue,
                minimumPurchaseAmount,
                active,
                startDate,
                endDate,
                applicableProducts,
                applicableCategories,
                maxUsagePerUser,
                totalUsageLimit
            });
            res.status(201).json(newPromotion);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create promotion', error });
        }
    }

    // Update a promotion
    static async updatePromotion(req: Request, res: Response): Promise<void> {
        const { promotionId } = req.params;
        const updateData = req.body;
        try {
            const updatedPromotion = await PromotionsModel.findByIdAndUpdate(
                promotionId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedPromotion) {
                res.status(404).json({ message: 'Promotion not found' });
                return;
            }
            res.json(updatedPromotion);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update promotion', error });
        }
    }

    // Retrieve a single promotion by ID
    static async getPromotionById(req: Request, res: Response): Promise<void> {
        const { promotionId } = req.params;
        try {
            const promotion = await PromotionsModel.findById(promotionId);
            if (!promotion) {
                res.status(404).json({ message: 'Promotion not found' });
                return;
            }
            res.json(promotion);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving promotion', error });
        }
    }

    // List all promotions
    static async getAllPromotions(req: Request, res: Response): Promise<void> {
        try {
            const promotions = await PromotionsModel.find({});
            res.json(promotions);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve promotions', error });
        }
    }

    // Delete a promotion
    static async deletePromotion(req: Request, res: Response): Promise<void> {
        const { promotionId } = req.params;
        try {
            const deletedPromotion = await PromotionsModel.findByIdAndDelete(promotionId);
            if (!deletedPromotion) {
                res.status(404).json({ message: 'Promotion not found' });
                return;
            }
            res.status(204).json({ message: 'Promotion deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete promotion', error });
        }
    }

    // Toggle promotion active status
    static async togglePromotionActive(req: Request, res: Response): Promise<void> {
        const { promotionId } = req.params;
        const { active } = req.body; // Expected to be a boolean value
        try {
            const promotion = await PromotionsModel.findById(promotionId);
            if (!promotion) {
                res.status(404).json({ message: 'Promotion not found' });
                return;
            }
            promotion.active = active;
            await promotion.save();
            res.json({ message: `Promotion ${active ? 'activated' : 'deactivated'}` });
        } catch (error) {
            res.status(500).json({ message: 'Failed to toggle promotion status', error });
        }
    }
}

export default PromotionController;
