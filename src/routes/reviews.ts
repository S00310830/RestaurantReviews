import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews';
import {validate} from '../middleware/validate.middleware';
import {createReviewZSchema}  from '../models/reviews';


const router = Router();
const reviewsController = new ReviewsController();

router.get('/', reviewsController.getReviews);

router.get('/:id', reviewsController.getReviewById);
router.post('/', validate(createReviewZSchema), reviewsController.createReview);
router.put('/:id', validate(createReviewZSchema), reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

export default router;
