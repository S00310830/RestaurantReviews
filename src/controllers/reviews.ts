import { Request, Response } from 'express';
import { ReviewService } from '../services/reviews';

const reviewsService = new ReviewService();

export class ReviewsController {
	/**
	 * @openapi
	 * /reviews:
	 *   get:
	 *     summary: Retrieve all reviews
	 *     tags:
	 *       - Reviews
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved reviews
	 *       404:
	 *         description: Reviews not found
	 *       500:
	 *         description: Internal server error
	 */
	getReviews = async (_req: Request, res: Response): Promise<void> => {
		try {
			const reviews = await reviewsService.getAllReviews();
			res.status(200).json(reviews);
		} catch (error) {
			res.status(500).json({ message: 'Error fetching reviews', error });
		}
	};

	/**
	 * @openapi
	 * /reviews/{id}:
	 *   get:
	 *     summary: Get a review by ID
	 *     tags:
	 *       - Reviews
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Review found
	 *       404:
	 *         description: Review not found
	 *       500:
	 *         description: Internal server error
	 */
	getReviewById = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
			const review = await reviewsService.getReviewById(id);

			if (!review) {
				res.status(404).json({ message: 'Review not found' });
				return;
			}

			res.status(200).json(review);
		} catch (error) {
			res.status(500).json({ message: 'Error fetching review', error });
		}
	};

	/**
	 * @openapi
	 * /reviews:
	 *   post:
	 *     summary: Create a new review
	 *     tags:
	 *       - Reviews
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateReviewInput'
	 *     responses:
	 *       201:
	 *         description: Successfully created review
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	createReview = async (req: Request, res: Response): Promise<void> => {
		try {
			const newReview = await reviewsService.createReview(req.body);
			res.status(201).json(newReview);
		} catch (error) {
			res.status(500).json({ message: 'Error inserting into MongoDB', error });
		}
	};

	/**
	 * @openapi
	 * /reviews/{id}:
	 *   put:
	 *     summary: Update a review by ID
	 *     tags:
	 *       - Reviews
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateReviewInput'
	 *     responses:
	 *       200:
	 *         description: Review updated successfully
	 *       404:
	 *         description: Review not found
	 *       500:
	 *         description: Internal server error
	 */
	updateReview = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
			const updatedReview = await reviewsService.updateReview(id, req.body);

			if (!updatedReview) {
				res.status(404).json({ message: 'Review not found' });
				return;
			}

			res.status(200).json(updatedReview);
		} catch (error) {
			res.status(500).json({ message: 'Error updating review', error });
		}
	};

	/**
	 * @openapi
	 * /reviews/{id}:
	 *   delete:
	 *     summary: Delete a review by ID
	 *     tags:
	 *       - Reviews
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Review deleted successfully
	 *       404:
	 *         description: Review not found
	 *       500:
	 *         description: Internal server error
	 */
	deleteReview = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
			const review = await reviewsService.getReviewById(id);

			if (!review) {
				res.status(404).json({ message: 'Review not found' });
				return;
			}

			await reviewsService.deleteReview(id);
			res.status(200).json({ message: 'Review deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error fetching review', error });
		}
	};
}
