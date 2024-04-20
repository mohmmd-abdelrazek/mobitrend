import { Request, Response } from 'express';
import CategoryModel from '../models/CategoryModel';

export class CategoryController {
    
    static async createCategory(req: Request, res: Response): Promise<void> {
        const { name, description, parent, metaTitle, metaDescription, metaKeywords, imageUrl } = req.body;
        try {
            const newCategory = await CategoryModel.create({
                name,
                description,
                parent,
                metaTitle,
                metaDescription,
                metaKeywords,
                imageUrl
            });
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create category', error });
        }
    }

    // Update a category
    static async updateCategory(req: Request, res: Response): Promise<void> {
        const { categoryId } = req.params;
        const updateData = req.body;
        try {
            const updatedCategory = await CategoryModel.findByIdAndUpdate(
                categoryId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedCategory) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            res.json(updatedCategory);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update category', error });
        }
    }

    // Get a single category by ID
    static async getCategoryById(req: Request, res: Response): Promise<void> {
        const { categoryId } = req.params;
        try {
            const category = await CategoryModel.findById(categoryId);
            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving category', error });
        }
    }

    // List all categories
    static async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await CategoryModel.find({});
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve categories', error });
        }
    }

    // Delete a category
    static async deleteCategory(req: Request, res: Response): Promise<void> {
        const { categoryId } = req.params;
        try {
            const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
            if (!deletedCategory) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            res.status(204).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete category', error });
        }
    }
}

export default CategoryController;
