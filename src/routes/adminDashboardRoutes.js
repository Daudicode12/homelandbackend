import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/requireRole.js";
import { getDashboard, getAllUsers, updateUserStatus } from "../controllers/adminController.js";

const router = Router();

// GET /api/admin/dashboard
router.get("/admin/dashboard", authenticate, requireRole("admin"), getDashboard);
// GET/api.admin/users
router.get("/admin/users", authenticate, requireRole("admin"), getAllUsers);
// PATCH /api/admin/users/:id/status
router.patch("/admin/users/:id/status", authenticate, requireRole("admin"), updateUserStatus);
// GET/api.admin/jobs
router.get("/admin/jobs", authenticate, requireRole("admin"), getAllJobs);
// GET/api.admin/contracts
router.get("/admin/contracts", authenticate, requireRole("admin"), getAllContracts);
// GET/api.admin/reviews
router.get("/admin/reviews", authenticate, requireRole("admin"), getAllReviews);
// Getting total escrow funds
router.get("/admin/escrow", authenticate, requireRole("admin"), getTotalEscrowFunds);

export { router as adminDashboardRoutes };