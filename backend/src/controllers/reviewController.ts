import { Request, Response } from "express";
import ReviewModel from "../models/ReviewModel";
import ProductModel from "../models/ProductModel";

// Create a review
export const addReview = async (req: Request, res: Response) => {
  const {productId} = req.params;
  const { rating, comment } = req.body;
  const user = req.user; // Assuming user is added to req by authentication middleware

  try {
    const existingReview = await ReviewModel.findOne({
      product: productId,
      user: user?._id,
    });
    if (existingReview) {
      res
        .status(400)
        .json({ message: "User has already reviewed this product." });
      return;
    }

    const review = new ReviewModel({
      product: productId,
      user: user?._id,
      name: user?.name,
      rating,
      comment,
    });
    await review.save();

    await ProductModel.updateAverageRating(productId); // Update the product's average rating

    res.status(201).json(review);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message); // Now safely accessing error.message
    } else {
      console.log("An unexpected error occurred");
    }
  }
};

// Get all reviews for a specific product
export const getReviewsByProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const reviews = await ReviewModel.find({ product: productId }).populate(
      "user",
      "name"
    );
    res.status(200).json(reviews);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message); // Now safely accessing error.message
    } else {
      console.log("An unexpected error occurred");
    }
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const user = req.user;

  try {
    const review = await ReviewModel.findOneAndUpdate(
      { _id: reviewId, user: user?._id },
      { rating, comment },
      { new: true }
    );
    if (!review) {
      res.status(404).json({
        message:
          "Review not found or user not authorized to update this review.",
      });
      return;
    }

    await ProductModel.updateAverageRating(review.product.toString()); // Recalculate the average rating

    res.status(200).json(review);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message); // Now safely accessing error.message
    } else {
      console.log("An unexpected error occurred");
    }
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const user = req.user;

  try {
    const review = await ReviewModel.findOneAndDelete({
      _id: reviewId,
      user: user?._id,
    });
    if (!review) {
      res.status(404).json({
        message:
          "Review not found or user not authorized to delete this review.",
      });
      return;
    }

    await ProductModel.updateAverageRating(review.product.toString()); // Update average rating after review deletion

    res.status(204).json({ message: "Review deleted successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message); // Now safely accessing error.message
    } else {
      console.log("An unexpected error occurred");
    }
  }
};
