import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";
import cloudinary from "../config/cloudinaryConfig";

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
      page,
      totalPages: Math.ceil(total / limit),
      products: products,
      productsCount: total,
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
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred", error });
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

export const getProductImages = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await cloudinary.search
      .expression(`folder:products/${id}`)
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();
    const images = result.resources.map(
      (resource: { secure_url: unknown }) => resource.secure_url
    );
    res.json(images);
  } catch (error) {
    console.error("Failed to fetch images:", error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const uploader = async (file: Express.Multer.File) =>
      await cloudinary.uploader.upload(file.path, {
        folder: `products/${id}`, // Store images in a specific folder per product
      });
    const urls = await Promise.all(
      (req.files as Express.Multer.File[]).map((file) => uploader(file))
    );
    res.status(200).json({
      message: "Images uploaded successfully",
      data: urls.map((url) => url.secure_url),
    });
  } catch (error) {
    console.error("Failed to upload images:", error);
    res.status(500).json({ message: "Failed to upload images" });
  }
};
