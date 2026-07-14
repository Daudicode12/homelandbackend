import { pool } from '../config/db.js';
import { approveAndReleaseEscrow } from '../services/escrowService.js';

export const autoReleaseEscrow = async () => {
  // DATE_SUB(NOW(), INTERVAL 3 DAY) finds contracts older than 3 days since delivery
  const [contracts] = await pool.execute(
    `SELECT id, amount, freelancer_id FROM contracts 
     WHERE status = 'delivered' AND delivered_at < DATE_SUB(NOW(), INTERVAL 3 DAY)`
  );

  let processed = contracts.length;
  let released = 0;

  for (const contract of contracts) {
    try {
      await approveAndReleaseEscrow(contract.id, contract.amount, contract.freelancer_id);
      released++;
    } catch (err) {
      console.error(\`Failed to auto-release contract \${contract.id}:\`, err);
    }
  }

  return { processed, released };
};
