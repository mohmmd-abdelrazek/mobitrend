// DeliveryModel.ts

import { Schema, model, Document, Types } from 'mongoose';

type DeliveryStatus = 'pending' | 'shipped' | 'in transit' | 'delivered' | 'failed';

interface IDelivery extends Document {
    order: Types.ObjectId;               // Reference to the Order
    trackingNumber: string;              // Tracking number for the delivery
    shippingMethod: Types.ObjectId;      // Reference to Shipping Method used
    status: DeliveryStatus;              // Current status of the delivery
    estimatedDeliveryDate: Date;         // Estimated date of delivery
    actualDeliveryDate: Date | null;     // Actual delivery date, if delivered
}

const deliverySchema = new Schema<IDelivery>({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    trackingNumber: { type: String, required: true },
    shippingMethod: { type: Schema.Types.ObjectId, ref: 'Shipping', required: true },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'in transit', 'delivered', 'failed'],
        default: 'pending'
    },
    estimatedDeliveryDate: { type: Date, required: true },
    actualDeliveryDate: { type: Date, default: null },
}, {
    timestamps: true
});

const DeliveryModel = model<IDelivery>('Delivery', deliverySchema);

export default DeliveryModel;
