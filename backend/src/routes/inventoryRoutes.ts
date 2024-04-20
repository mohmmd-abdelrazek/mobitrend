import { Router } from 'express';
import InventoryController from '../controllers/inventoryController';
import { isAdmin } from '../middleware/middleware'; // Assuming you have these middleware for access control

const router = Router();

router.post('/inventory', isAdmin, InventoryController.addInventory);

router.put('/inventory/:inventoryId', isAdmin, InventoryController.updateInventory);

router.get('/inventory', isAdmin, InventoryController.getAllInventory);

router.get('/inventory/product/:productId', isAdmin, InventoryController.getInventoryByProduct);

router.delete('/inventory/:inventoryId', isAdmin, InventoryController.deleteInventory);

export default router;
