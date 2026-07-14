import { Router } from 'express';
import { fundContract, deliverContract, approveContract, disputeContract } from '../controllers/contractController.js';
import { disputeValidator } from '../validators/contractValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.post('/:id/fund', authenticate, requireRole('employer'), fundContract);
router.post('/:id/deliver', authenticate, requireRole('freelancer'), deliverContract);
router.post('/:id/approve', authenticate, requireRole('employer'), approveContract);
router.post('/:id/dispute', authenticate, disputeValidator, validateRequest, disputeContract);

export default router;
