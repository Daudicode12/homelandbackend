import { query, pool } from '../config/db.js';

export const checkExistingProposal = async (jobId, freelancerId) => {
  const [rows] = await query('SELECT id FROM proposals WHERE job_id = ? AND freelancer_id = ?', [jobId, freelancerId]);
  return rows.length > 0;
};

export const createProposal = async (proposalData) => {
  const { job_id, freelancer_id, cover_letter, proposed_budget, timeline_days } = proposalData;
  const sql = `
    INSERT INTO proposals (job_id, freelancer_id, cover_letter, proposed_budget, timeline_days)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [job_id, freelancer_id, cover_letter, proposed_budget, timeline_days];
  const [result] = await query(sql, values);
  
  const [newProposal] = await query('SELECT * FROM proposals WHERE id = ?', [result.insertId]);
  return newProposal[0];
};

export const getProposalById = async (id) => {
  const [rows] = await query('SELECT * FROM proposals WHERE id = ?', [id]);
  return rows[0];
};

export const acceptProposalTransaction = async (jobId, proposalId, employerId, freelancerId) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Accept selected proposal
    await connection.execute(
      'UPDATE proposals SET status = ? WHERE id = ?',
      ['accepted', proposalId]
    );

    // 2. Reject every other proposal for the same job
    await connection.execute(
      'UPDATE proposals SET status = ? WHERE job_id = ? AND id != ?',
      ['rejected', jobId, proposalId]
    );

    // 3. Get proposal amount
    const [proposalRows] = await connection.execute('SELECT proposed_budget FROM proposals WHERE id = ?', [proposalId]);
    const amount = proposalRows[0].proposed_budget;

    // 4. Create a Contract record
    const contractSql = `
      INSERT INTO contracts (job_id, proposal_id, employer_id, freelancer_id, amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const contractValues = [jobId, proposalId, employerId, freelancerId, amount, 'pending'];
    await connection.execute(contractSql, contractValues);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
