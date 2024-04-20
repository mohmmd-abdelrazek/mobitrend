import { Router } from 'express';
import ShippingController from '../controllers/shippingController';
import { isAdmin } from '../middleware/middleware'; // Assuming you have these middleware for authentication and role-based authorization

const router = Router();

// Shipping routes
router.post('/', isAdmin, ShippingController.createShippingMethod);
router.put('/:shippingMethodId', isAdmin, ShippingController.updateShippingMethod);
router.get('/', isAdmin, ShippingController.getAllShippingMethods);

export default router;
