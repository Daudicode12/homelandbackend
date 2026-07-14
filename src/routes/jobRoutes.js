import { Router } from 'express';
import { getJobs, createJob, getJobById } from '../controllers/jobController.js';
import { submitProposal, acceptProposal } from '../controllers/proposalController.js';
import { createJobValidator } from '../validators/jobValidator.js';
import { createProposalValidator } from '../validators/proposalValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// Jobs
router.get('/', getJobs);
router.post('/', authenticate, requireRole('employer'), createJobValidator, validateRequest, createJob);
router.get('/:id', getJobById);

// Proposals
router.post('/:id/proposals', authenticate, requireRole('freelancer'), createProposalValidator, validateRequest, submitProposal);
router.put('/:id/proposals/:proposalId/accept', authenticate, requireRole('employer'), acceptProposal);

export default router;
