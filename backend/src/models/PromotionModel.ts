import { Schema, model, Document, Types } from 'mongoose';

interface IPromotion extends Document {
    name: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minimumPurchaseAmount?: number;
    active: boolean;
    startDate: Date;
    endDate: Date;
    applicableProducts: Types.ObjectId[];  // Products to which the promotion applies
    applicableCategories: Types.ObjectId[]; // Categories to which the promotion applies
    maxUsagePerUser?: number;               // Maximum number of times a single user can use this promotion
    totalUsageLimit?: number;               // Total number of times this promotion can be used
}

const promotionSchema = new Schema<IPromotion>({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number, required: true },
    minimumPurchaseAmount: { type: Number },
    active: { type: Boolean, default: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    maxUsagePerUser: { type: Number },
    totalUsageLimit: { type: Number }
}, {
    timestamps: true  // Tracks when promotion records are created or modified
});

const PromotionsModel = model<IPromotion>('Promotion', promotionSchema);

export default PromotionsModel;
