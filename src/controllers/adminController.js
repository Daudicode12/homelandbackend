import adminService from '../services/adminService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export const getDashboard = async (req, res, next) => {
    try {
        const dashboardData = await adminService.getDashboardOverview();
        return successResponse(res, 200, 'Dashboard data retrieved successfully.', dashboardData);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, search, role, status } = req.query;
        const users = await adminService.getAllUsers(page, limit, search, role, status);
        return successResponse(res, 200, 'Users retrieved successfully.', users);
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const adminId = req.user.id; // Or req.user.userId depending on JWT format

        const result = await adminService.updateUserStatus(parseInt(id, 10), status, adminId);
        return successResponse(res, 200, 'User status updated successfully.', result);
    } catch (error) {
        if (error.message === 'Admin cannot suspend himself' || error.message === 'User not found') {
            return errorResponse(res, error.message === 'User not found' ? 404 : 400, error.message);
        }
        next(error);
    }
};

export const getAllJobs = async (req, res, next) => {
    try {
        const { page, limit, search, status } = req.query;
        const jobs = await adminService.getAllJobs(page, limit, search, status);
        return successResponse(res, 200, 'Jobs retrieved successfully.', jobs);
    } catch (error) {
        next(error);
    }
};

export const updateJobStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await adminService.updateJobStatus(parseInt(id, 10), status);
        return successResponse(res, 200, 'Job status updated successfully.', result);
    } catch (error) {
        if (error.message === 'Job not found') {
            return errorResponse(res, 404, error.message);
        }
        next(error);
    }
};

export const getJobsAnalytics = async (req, res, next) => {
    try {
        const analytics = await adminService.getJobsAnalytics();
        return successResponse(res, 200, 'Jobs analytics retrieved successfully.', analytics);
    } catch (error) {
        next(error);
    }
};