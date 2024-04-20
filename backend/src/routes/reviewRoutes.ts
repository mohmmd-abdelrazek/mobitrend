import express from 'express';
import * as reviewController from '../controllers/reviewController';
import { isAuthenticated } from '../middleware/middleware'; 

const router = express.Router();

router.post('/:productId', isAuthenticated, reviewController.addReview);

router.get('/:productId', reviewController.getReviewsByProduct);


router.put('/:reviewId', isAuthenticated, reviewController.updateReview);

router.delete('/:reviewId', isAuthenticated, reviewController.deleteReview);

export default router;
