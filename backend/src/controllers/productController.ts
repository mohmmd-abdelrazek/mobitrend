import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";

// Get all products with pagination
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments();

    res.status(200).json({
      status: "success",
      count: products.length,
      page,
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message: "An unexpected error occurred", error})
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({message: "An unexpected error occurred", error})
  }
};

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).json({ message: "Product deleted" }); // No content to send back
  } catch (error) {
    res.status(500).json(error);
  }
};

// Handle product stock (could be for an update stock endpoint)
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id, stock } = req.body;
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};
