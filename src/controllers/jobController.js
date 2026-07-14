import * as jobService from '../services/jobService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export const getJobs = async (req, res, next) => {
  try {
    const { search, category, location, budget_min, budget_max, sort, page, limit } = req.query;
    
    const filters = {
      search,
      category,
      location,
      budget_min: budget_min ? parseFloat(budget_min) : undefined,
      budget_max: budget_max ? parseFloat(budget_max) : undefined,
      sort: sort || 'newest',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10
    };

    const result = await jobService.getJobs(filters);

    return res.status(200).json({
      success: true,
      data: {
        jobs: result.jobs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { title, description, category, location, budget, deadline } = req.body;
    const employer_id = req.user.userId;

    const newJob = await jobService.createJob({
      employer_id,
      title,
      description,
      category,
      location,
      budget,
      deadline
    });

    return successResponse(res, 201, 'Job created successfully.', newJob);
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);

    if (!job) {
      return errorResponse(res, 404, 'Job not found.');
    }

    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
};
