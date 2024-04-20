import { Request, Response } from 'express';
import PaymentModel from '../models/PaymentModel';

export class PaymentController {

    // Create a new payment
    static async createPayment(req: Request, res: Response): Promise<void> {
        const { user, orderId, amount, currency, method, transactionId, details } = req.body;

        try {
            const payment = await PaymentModel.create({
                user,
                orderId,
                amount,
                currency,
                status: 'pending', // Default status
                transactionId,
                method,
                details
            });

            res.status(201).json(payment);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create payment', error });
        }
    }

    // Update payment status
    static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
        const { paymentId } = req.params;
        const { status } = req.body;

        try {
            const updatedPayment = await PaymentModel.findByIdAndUpdate(
                paymentId,
                { status },
                { new: true, runValidators: true }
            );

            if (!updatedPayment) {
                res.status(404).json({ message: 'Payment not found' });
                return;
            }

            res.json(updatedPayment);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update payment status', error });
        }
    }

    // Retrieve a payment by ID
    static async getPaymentById(req: Request, res: Response): Promise<void> {
        const { paymentId } = req.params;

        try {
            const payment = await PaymentModel.findById(paymentId).populate('user orderId');
            if (!payment) {
                res.status(404).json({ message: 'Payment not found' });
                return;
            }

            res.json(payment);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve payment', error });
        }
    }

    // Retrieve all payments for a user
    static async getPaymentsByUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        try {
            const payments = await PaymentModel.find({ user: userId });
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve payments', error });
        }
    }

    // Handle payment confirmation from external systems (e.g., webhook)
    static async confirmPayment(req: Request, res: Response): Promise<void> {
        const { transactionId, status } = req.body;

        try {
            const payment = await PaymentModel.findOneAndUpdate(
                { transactionId },
                { status },
                { new: true }
            );

            if (!payment) {
                res.status(404).json({ message: 'Transaction not found or already updated' });
                return;
            }

            res.json({ message: 'Payment confirmed successfully', payment });
        } catch (error) {
            res.status(500).json({ message: 'Failed to confirm payment', error });
        }
    }

    // Additional method to handle payment cancellation or failure recovery
    static async handlePaymentFailure(req: Request, res: Response): Promise<void> {
        const { paymentId } = req.params;

        try {
            const payment = await PaymentModel.findById(paymentId);
            if (!payment) {
                res.status(404).json({ message: 'Payment not found' });
                return;
            }

            // Implement logic based on payment method or business requirements
            if (payment.status !== 'completed') {
                await PaymentModel.findByIdAndUpdate(paymentId, { status: 'failed' });
                res.json({ message: 'Payment marked as failed' });
            } else {
                res.status(400).json({ message: 'Payment already completed, cannot mark as failed' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to handle payment failure', error });
        }
    }

    // Delete a payment (if needed for admin purposes or correction)
    static async deletePayment(req: Request, res: Response): Promise<void> {
        const { paymentId } = req.params;

        try {
            const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId);
            if (!deletedPayment) {
                res.status(404).json({ message: 'Payment not found' });
                return;
            }

            res.status(204).json({ message: 'Payment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete payment', error });
        }
    }
}
