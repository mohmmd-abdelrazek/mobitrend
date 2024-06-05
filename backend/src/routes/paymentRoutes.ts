import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { isAuthenticated, isAdmin} from "../middleware/middleware"; // Assuming you have authentication and authorization middleware

const router = Router();

router.post('/create-checkout-session', isAuthenticated, PaymentController.createCheckoutSession);

router.post('/payments', isAuthenticated, PaymentController.createPayment);

router.put('/payments/:paymentId/status', isAdmin, PaymentController.updatePaymentStatus);

router.get('/payments/:paymentId', isAuthenticated, PaymentController.getPaymentById);

router.get('/user/:userId/payments',  isAdmin, PaymentController.getPaymentsByUser);

// Route to confirm payment from external systems (webhook)
router.post('/payments/confirm', PaymentController.confirmPayment);

router.post('/payments/:paymentId/failure', isAdmin, PaymentController.handlePaymentFailure);

router.delete('/payments/:paymentId', isAdmin, PaymentController.deletePayment);


export default router;
