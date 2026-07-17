import * as proposalService from '../services/proposalService.js';
import * as jobService from '../services/jobService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export const submitProposal = async (req, res, next) => {
  try {
    const { id: job_id } = req.params;
    const { cover_letter, proposed_budget, timeline_days } = req.body;
    const freelancer_id = req.user.userId;

    const job = await jobService.getJobById(job_id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found.');
    }

    const hasApplied = await proposalService.checkExistingProposal(job_id, freelancer_id);
    if (hasApplied) {
      return errorResponse(res, 409, 'You have already submitted a proposal for this job.');
    }

    const newProposal = await proposalService.createProposal({
      job_id,
      freelancer_id,
      cover_letter,
      proposed_budget,
      timeline_days
    });

    return successResponse(res, 201, 'Proposal submitted successfully.', newProposal);
  } catch (err) {
    next(err);
  }
};

export const acceptProposal = async (req, res, next) => {
  try {
    const { id: jobId, proposalId } = req.params;
    const employerId = req.user.userId;

    const job = await jobService.getJobById(jobId);
    if (!job) {
      return errorResponse(res, 404, 'Job not found.');
    }

    if (job.employer_id !== employerId) {
      return errorResponse(res, 403, 'Access denied.');
    }

    const proposal = await proposalService.getProposalById(proposalId);
    if (!proposal || proposal.job_id !== parseInt(jobId)) {
      return errorResponse(res, 404, 'Proposal not found for this job.');
    }

    const contractId = await proposalService.acceptProposalTransaction(
      jobId,
      proposalId,
      employerId,
      proposal.freelancer_id
    );

    return successResponse(res, 200, 'Proposal accepted and contract created.', {
      contractId,
    });
  } catch (err) {
    next(err);
  }
};
