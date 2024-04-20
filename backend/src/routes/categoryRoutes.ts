import { Router } from 'express';
import CategoryController from '../controllers/categoryController';
import { isAdmin } from '../middleware/middleware'; 

const router = Router();

// Route to create a new category
router.post('/', isAdmin, CategoryController.createCategory);

// Route to update an existing category
router.put('/:categoryId', isAdmin, CategoryController.updateCategory);

// Route to get a single category by ID
router.get('/:categoryId', CategoryController.getCategoryById);

// Route to list all categories
router.get('/', CategoryController.getAllCategories);

// Route to delete a category
router.delete('/:categoryId', isAdmin, CategoryController.deleteCategory);

export default router;
