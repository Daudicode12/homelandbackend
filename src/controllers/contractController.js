import * as escrowService from '../services/escrowService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export const fundContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employerId = req.user.userId;

    const contract = await escrowService.getContractById(id);
    if (!contract) return errorResponse(res, 404, 'Contract not found.');
    if (contract.employer_id !== employerId) return errorResponse(res, 403, 'Access denied.');
    if (contract.status !== 'pending') return errorResponse(res, 409, 'Contract is already funded.');

    const result = await escrowService.fundEscrow(id, contract.amount);
    
    return successResponse(res, 200, 'Escrow funded successfully.', result);
  } catch (err) {
    next(err);
  }
};

export const deliverContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user.userId;

    const contract = await escrowService.getContractById(id);
    if (!contract) return errorResponse(res, 404, 'Contract not found.');
    if (contract.freelancer_id !== freelancerId) return errorResponse(res, 403, 'Access denied.');
    if (contract.status !== 'funded') return errorResponse(res, 409, 'Contract is not funded.');

    await escrowService.deliverContract(id);
    
    return successResponse(res, 200, 'Work marked as delivered.', { status: 'delivered' });
  } catch (err) {
    next(err);
  }
};

export const approveContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employerId = req.user.userId;

    const contract = await escrowService.getContractById(id);
    if (!contract) return errorResponse(res, 404, 'Contract not found.');
    if (contract.employer_id !== employerId) return errorResponse(res, 403, 'Access denied.');
    if (contract.status !== 'delivered') return errorResponse(res, 409, 'Contract is not delivered.');

    const distribution = await escrowService.approveAndReleaseEscrow(id, contract.amount, contract.freelancer_id);
    
    return successResponse(res, 200, 'Escrow released successfully.', distribution);
  } catch (err) {
    next(err);
  }
};

export const disputeContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { reason } = req.body;

    const contract = await escrowService.getContractById(id);
    if (!contract) return errorResponse(res, 404, 'Contract not found.');
    if (contract.employer_id !== userId && contract.freelancer_id !== userId) {
      return errorResponse(res, 403, 'Access denied.');
    }

    await escrowService.disputeContract(id, userId, reason);
    
    return successResponse(res, 200, 'Dispute opened successfully.', {});
  } catch (err) {
    next(err);
  }
};
