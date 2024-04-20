import { Router } from 'express';
import PromotionController from '../controllers/promotionController';
import { isAuthenticated, isAdmin } from '../middleware/middleware'; // Assuming you have these middleware for access control

const router = Router();

router.post('/', isAdmin, PromotionController.createPromotion);

// Route to update an existing promotion
router.put('/:promotionId', isAdmin, PromotionController.updatePromotion);

// Route to retrieve a single promotion by ID
router.get('/:promotionId', isAuthenticated, PromotionController.getPromotionById);

// Route to list all promotions
router.get('/', isAuthenticated, PromotionController.getAllPromotions);

// Route to delete a promotion
router.delete('/:promotionId', isAdmin, PromotionController.deletePromotion);

// Route to toggle the active status of a promotion
router.patch('/:promotionId/active', isAdmin, PromotionController.togglePromotionActive);

export default router;
