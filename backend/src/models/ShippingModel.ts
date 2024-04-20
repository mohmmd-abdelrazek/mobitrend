// ShippingModel.ts

import { Schema, model, Document } from 'mongoose';

interface IShipping extends Document {
    method: string;                   // E.g., Standard, Express, Overnight
    cost: number;                     // Cost of this shipping method
    region: string;                   // Region this method is available in
    estimatedDelivery: number;        // Estimated delivery time in days
    isActive: boolean;                // If this shipping method is currently active
}

const shippingSchema = new Schema<IShipping>({
    method: { type: String, required: true },
    cost: { type: Number, required: true },
    region: { type: String, required: true },
    estimatedDelivery: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

const ShippingModel = model<IShipping>('Shipping', shippingSchema);

export default ShippingModel;
