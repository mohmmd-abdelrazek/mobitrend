import { Schema, model, Document, Types } from "mongoose";

interface ICategory extends Document {
  name: string;
  description?: string;
  parent: Types.ObjectId | null; // Reference to parent category for nesting
  ancestors: Array<Types.ObjectId | null>; // An array to store the path from the root to this category
  imageUrl?: string; // Optional URL for category image
  isActive: boolean; // To toggle category visibility on the site
  metaTitle?: string; // SEO meta title
  metaDescription?: string; // SEO meta description
  metaKeywords?: string[]; // SEO keywords
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    ancestors: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    imageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: [{ type: String, trim: true }],
  },
  {
    timestamps: true, // Tracks when category records are created or modified
  }
);

// Middleware to handle updating ancestors and maintaining the category tree
categorySchema.pre("save", function (next) {
  if (this.isNew) {
    if (!this.parent) {
      this.ancestors = []; // Root category
    } else {
      // Get parent category's ancestors and add parent to the list
      this.model("Category").findById(
        this.parent,
        (err: Error | null, parent: ICategory) => {
          if (err) {
            next(err);
          } else {
            this.ancestors = [...parent.ancestors, this.parent];
            next();
          }
        }
      );
    }
  } else {
    next();
  }
});

const CategoryModel = model<ICategory>("Category", categorySchema);

export default CategoryModel;
