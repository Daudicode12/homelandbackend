import { query, body, param } from 'express-validator';

export const getUsersValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('role').optional().isIn(['admin', 'employer', 'freelancer']).withMessage('Invalid role filter'),
    query('status').optional().isIn(['active', 'suspended']).withMessage('Invalid status filter'),
    query('search').optional().isString()
];

export const updateUserStatusValidator = [
    param('id').isInt().withMessage('Invalid user ID'),
    body('status').isIn(['active', 'suspended']).withMessage('Status must be active or suspended')
];

export const getJobsValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('status').optional().isIn(['open', 'paused', 'closed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status filter'),
    query('search').optional().isString()
];

export const updateJobStatusValidator = [
    param('id').isInt().withMessage('Invalid job ID'),
    body('status').isIn(['open', 'paused', 'closed']).withMessage('Status must be open, paused or closed')
];
