import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { 
    getDashboard, 
    getAllUsers, 
    updateUserStatus, 
    getAllJobs, 
    updateJobStatus, 
    getJobsAnalytics 
} from "../controllers/adminController.js";
import { 
    getUsersValidator, 
    updateUserStatusValidator, 
    getJobsValidator, 
    updateJobStatusValidator 
} from "../validators/adminValidator.js";

const router = Router();

// GET /api/admin/dashboard
router.get("/dashboard", authenticate, requireRole("admin"), getDashboard);

// GET /api/admin/users
router.get("/users", authenticate, requireRole("admin"), getUsersValidator, validateRequest, getAllUsers);

// PATCH /api/admin/users/:id/status
router.patch("/users/:id/status", authenticate, requireRole("admin"), updateUserStatusValidator, validateRequest, updateUserStatus);

// GET /api/admin/jobs
router.get("/jobs", authenticate, requireRole("admin"), getJobsValidator, validateRequest, getAllJobs);

// PATCH /api/admin/jobs/:id/status
router.patch("/jobs/:id/status", authenticate, requireRole("admin"), updateJobStatusValidator, validateRequest, updateJobStatus);

// GET /api/admin/stats/jobs-per-day
router.get("/stats/jobs-per-day", authenticate, requireRole("admin"), getJobsAnalytics);

export { router as adminDashboardRoutes };