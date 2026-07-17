import { successResponse, errorResponse } from '../utils/responses.js';
import { createReviewService, getFreelancerReviewsService } from '../services/reviewsService.js';

export const createReview = async (req, res) => {
  const { contractId, rating, comment } = req.body;
  const employerId = req.user.userId; // Assuming authMiddleware sets req.user.userId

  try {
    const freelancer = await createReviewService(contractId, employerId, rating, comment);
    return successResponse(res, 201, 'Review submitted successfully.', { freelancer });
  } catch (error) {
    console.error('Create Review Error:', error);
    const status = error.status || 500;
    const message = error.status ? error.message : 'Internal server error.';
    return errorResponse(res, status, message);
  }
};

export const getFreelancerReviews = async (req, res) => {
  const freelancerId = parseInt(req.params.id, 10);
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (isNaN(freelancerId)) {
    return errorResponse(res, 400, 'Invalid freelancer ID.');
  }

  try {
    const data = await getFreelancerReviewsService(freelancerId, page, limit);
    return successResponse(res, 200, 'Reviews fetched successfully.', data);
  } catch (error) {
    console.error('Get Freelancer Reviews Error:', error);
    const status = error.status || 500;
    const message = error.status ? error.message : 'Internal server error.';
    return errorResponse(res, status, message);
  }
};