import { Schema, Types, model } from 'mongoose';

export interface IOrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: Types.ObjectId; // Reference to the individual product
}

interface IOrder {
    user: Types.ObjectId; // Reference to the user who placed the order
    orderItems: IOrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentResult: {
        id: string; // Payment ID from payment gateway
        status: string;
        update_time: string;
        email_address: string;
    };
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date }
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

const OrderModel = model<IOrder>('Order', orderSchema);
export default OrderModel;
