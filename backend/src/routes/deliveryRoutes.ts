import { Router } from 'express';
import DeliveryController from '../controllers/deliveryController';
import { isAuthenticated, isAdmin } from '../middleware/middleware'; // Assuming you have these middleware for authentication and role-based authorization

const router = Router();

// Delivery routes
router.post('/', isAdmin, DeliveryController.createDelivery);
router.put('/:deliveryId/status', isAdmin, DeliveryController.updateDeliveryStatus);
router.get('/:deliveryId', isAuthenticated, DeliveryController.getDeliveryById);

export default router;
