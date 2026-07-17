import express from 'express';
import { createReviewValidator } from '../validators/reviewsValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createReview, getFreelancerReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// POST /api/reviews
// We mount this router at /api in app.js, so the path is /reviews
router.post(
  '/reviews',
  authenticate,
  requireRole('employer'),
  createReviewValidator,
  validateRequest,
  createReview
);

// GET /api/freelancers/:id/reviews
router.get(
  '/freelancers/:id/reviews',
  getFreelancerReviews
);

export default router;
