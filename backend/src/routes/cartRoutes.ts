import express from "express"
import * as cartController from "../controllers/cartController"

const router = express.Router();

router.post('/add', cartController.addItemToCart);

router.post('/remove', cartController.removeItemFromCart);

router.post('/update', cartController.updateItemInCart);

router.get('/', cartController.getCart);

router.post('/clear', cartController.clearCart);

export default router;