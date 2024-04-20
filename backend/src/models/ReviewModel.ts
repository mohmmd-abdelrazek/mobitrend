import { Schema, model, Document, Types } from 'mongoose';

interface IReview extends Document {
    product: Types.ObjectId;  // Reference to Product
    user: Types.ObjectId;     // Reference to User
    name: string;
    rating: number;
    comment: string;
}

const reviewSchema = new Schema<IReview>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, {
    timestamps: true  // Handles createdAt and updatedAt
});

const ReviewModel = model<IReview>('Review', reviewSchema);
export default ReviewModel;
