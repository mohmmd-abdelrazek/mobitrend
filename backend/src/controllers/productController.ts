import { Request, Response } from "express";
import fs from 'fs';
import { promisify } from 'util';
import ProductModel from "../models/ProductModel";
import cloudinary from "../config/cloudinaryConfig";

const unlinkAsync = promisify(fs.unlink);

export const getAllProducts = async (req: Request, res: Response) => {
  interface QueryParams {
    categories?: string;
    ratings?: string;
    priceRange?: string;
    keyword?: string;
  }

  interface MongoFilter {
    category?: { $in: string[] };
    rating?: { $gte: number };
    price?: { $gte: number; $lte: number };
    name?: { $regex: string; $options: string };
  }

  const buildFilter = (query: QueryParams): MongoFilter => {
    const filter: MongoFilter = {};

    if (query.categories) {
      filter.category = { $in: query.categories.split(",") };
    }

    if (query.ratings) {
      const ratings = query.ratings.split(",").map(Number);
      // Ensure to handle ratings appropriately if expecting ranges or multiple checks
      filter.rating = { $gte: Math.min(...ratings) };
    }

    if (query.priceRange) {
      const [min, max] = query.priceRange.split("-").map(Number);
      filter.price = { $gte: min, $lte: max };
    }

    if (query.keyword) {
      filter.name = { $regex: query.keyword, $options: "i" }; // Case insensitive searching
    }

    return filter;
  };

  interface SortQuery {
    sort?: string;
  }
  interface SortOptions {
    [key: string]: 1 | -1;
  }

  const parseSort = (query: SortQuery): SortOptions => {
    let sortOptions: SortOptions = { createdAt: -1 };
    if (query.sort) {
      const [field, order] = query.sort.split("-");
      if (field && order) {
        sortOptions = {
          [field]: order === "asc" ? 1 : -1,
        };
      }
    }
    return sortOptions;
  };

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = req.query.keyword ? 0 : 6;
    const skip = (page - 1) * limit;

    const filter = buildFilter(req.query);
    const sortOptions = parseSort(req.query);

    const products = await ProductModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    const total = await ProductModel.countDocuments(filter);

    res.status(200).json({
      status: "success",
      page,
      totalPages: limit ? Math.ceil(total / limit) : 1,
      products: products,
      productsCount: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
};

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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await cloudinary.api.delete_resources_by_prefix(`products/${id}`);
    await cloudinary.api.delete_folder(`products/${id}`);
    const product = await ProductModel.findByIdAndDelete(id);
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
    res.status(200).json({ images });
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
        folder: `products/${id}`,
      });
    const urls = await Promise.all(
      (req.files as Express.Multer.File[]).map((file) => uploader(file))
    );

    await Promise.all(
      (req.files as Express.Multer.File[]).map((file) =>
        unlinkAsync(file.path)
      )
    );

    // Fetch the product from the database
    const product = await ProductModel.findById(id);

    if (product) {
      // Update product's images array with new URLs
      product.images.unshift(...urls.map((url) => url.secure_url));

      // Save the updated product back to the database
      await product.save();
    }

    res.status(200).json({
      message: "Images uploaded successfully",
      data: urls.map((url) => url.secure_url),
    });
  } catch (error) {
    console.error("Failed to upload images:", error);
    res.status(500).json({ message: "Failed to upload images" });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.params;
    const publicId = extractPublicId(decodeURIComponent(imageUrl));

    if (!publicId) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Failed to delete image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

function extractPublicId(imageUrl: string): string | null {
  const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return matches ? matches[1] : null;
}