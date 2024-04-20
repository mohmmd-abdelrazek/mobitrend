import { Schema, Types, model } from 'mongoose';

// Define the possible status types as TypeScript type for stronger type checks.
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type PaymentMethod = 'credit_card' | 'paypal' | 'stripe' | 'crypto';

// Interface to define the structure of a payment document.
interface IPayment {
    user: Types.ObjectId;
    orderId: Types.ObjectId;
    amount: number;
    currency: string;
    status: PaymentStatus;
    transactionId: string;
    method: PaymentMethod;
    details: unknown;  // Flexible field for payment gateway responses or additional details.
}

// Define the schema for the payment documents.
const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: { type: String, required: true },
    method: {
        type: String,
        enum: ['credit_card', 'paypal', 'stripe', 'crypto'],
        required: true
    },
    details: { type: Schema.Types.Mixed }
}, {
    timestamps: true  // Automatically adds 'createdAt' and 'updatedAt' fields.
});

// Create the Mongoose model from the schema.
const PaymentModel = model<IPayment>('Payment', paymentSchema);

// Export the model to use it in other parts of the application.
export default PaymentModel;
