import { Schema, Document, model, Types } from 'mongoose';

export interface ICartItem {
    product: Types.ObjectId;
    name: string;
    image: string;
    price: number;
    countInStock: number;
    qty: number;
}

interface CartModel {
    calculateTotal: () => void;
}

interface ICart extends Document, CartModel {
    user: Types.ObjectId;  // User reference is now optional
    cartItems: ICartItem[];
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
}

const cartItemSchema = new Schema<ICartItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 }
});

const cartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [cartItemSchema],
    paymentMethod: { type: String },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});

// Methods to calculate cart totals
cartSchema.methods.calculateTotal = function () {
    this.itemsPrice = this.cartItems.reduce((acc: number, item: ICartItem) => acc + item.qty * item.price, 0);
    // Assuming a flat tax rate of 10%
    this.taxPrice = this.itemsPrice * 0.1;
    // Assuming a flat shipping rate, could be dynamic based on address
    this.shippingPrice = this.itemsPrice > 500 ? 0 : 25;
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
};

const CartModel = model<ICart>('Cart', cartSchema);
export default CartModel;
