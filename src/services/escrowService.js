import { pool, query } from '../config/db.js';
import { generateReceiptNumber } from '../utils/generateReceipt.js';
import { recordPayments } from './paymentService.js';

export const getContractById = async (id) => {
  const [rows] = await query('SELECT * FROM contracts WHERE id = ?', [id]);
  return rows[0];
};

export const fundEscrow = async (contractId, amount) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const receiptNumber = generateReceiptNumber();

    await connection.execute(
      'INSERT INTO escrow (contract_id, amount, status, receipt_number) VALUES (?, ?, ?, ?)',
      [contractId, amount, 'funded', receiptNumber]
    );

    await connection.execute(
      'UPDATE contracts SET status = ?, funded_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['funded', contractId]
    );

    await connection.commit();
    return { receiptNumber, status: 'funded' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deliverContract = async (contractId) => {
  await query(
    'UPDATE contracts SET status = ?, delivered_at = CURRENT_TIMESTAMP WHERE id = ?',
    ['delivered', contractId]
  );
};

export const approveAndReleaseEscrow = async (contractId, amount, freelancerId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const distribution = await recordPayments(connection, contractId, freelancerId, amount);

    await connection.execute(
      'UPDATE contracts SET status = ?, released_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['released', contractId]
    );

    // Update escrow record status
    await connection.execute(
      'UPDATE escrow SET status = ? WHERE contract_id = ?',
      ['released', contractId]
    );
    // update contract status to 'approved' and set approved_at timestamp
    await connection.execute(
      'UPDATE contracts SET status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['approved', contractId]
    );

    await connection.commit();
    return distribution;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const disputeContract = async (contractId, openedBy, reason) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    await connection.execute(
      'INSERT INTO disputes (contract_id, opened_by, reason) VALUES (?, ?, ?)',
      [contractId, openedBy, reason]
    );
    
    await connection.execute(
      'UPDATE contracts SET status = ? WHERE id = ?',
      ['disputed', contractId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
