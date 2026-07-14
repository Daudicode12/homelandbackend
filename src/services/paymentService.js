import { generateReceiptNumber } from '../utils/generateReceipt.js';

export const calculateDistribution = (amount) => {
  const freelancerAmount = amount * 0.92;
  const platformFee = amount * 0.08;
  return { freelancerAmount, platformFee };
};

export const recordPayments = async (connection, contractId, freelancerId, amount) => {
  const { freelancerAmount, platformFee } = calculateDistribution(amount);

  const reference1 = generateReceiptNumber();
  const reference2 = generateReceiptNumber();

  const sql = `INSERT INTO payments (contract_id, recipient_id, payment_type, amount, reference) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)`;
  
  await connection.execute(sql, [
    contractId, freelancerId, 'freelancer', freelancerAmount, reference1,
    contractId, null, 'platform_fee', platformFee, reference2
  ]);

  return { freelancerAmount, platformFee };
};
