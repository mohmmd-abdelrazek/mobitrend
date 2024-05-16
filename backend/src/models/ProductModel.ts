import { Schema, Document, Model, model } from "mongoose";
import ReviewModel from "./ReviewModel";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  brand: string;
  inStock: number;
  rating: number; // Average rating, calculated dynamically
  numReviews: number;
  discount: number;
}

interface ProductMethods extends Model<IProduct> {
  updateAverageRating(productId: string): Promise<void>;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    brand: { type: String, required: true },
    inStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Static method to calculate and update average rating
productSchema.statics.updateAverageRating = async function (productId) {
  const reviews = await ReviewModel.find({ product: productId });
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  const averageRating = reviews.length > 0 ? sum / reviews.length : 0;
  await this.findByIdAndUpdate(productId, {
    rating: averageRating,
    numReviews: reviews.length,
  });
};

productSchema.index({ name: "text", description: "text" });

const ProductModel = model<IProduct, ProductMethods>("Product", productSchema);
export default ProductModel;
