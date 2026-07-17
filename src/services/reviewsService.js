import { pool } from '../config/db.js';

export const createReviewService = async (contractId, employerId, rating, comment) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Verify Contract
    const [contracts] = await connection.execute(
      `SELECT id, freelancer_id, status FROM contracts 
       WHERE id = ? AND employer_id = ? FOR UPDATE`,
      [contractId, employerId]
    );

    if (contracts.length === 0) {
      const err = new Error('Contract not found or not authorized.');
      err.status = 404;
      throw err;
    }

    const contract = contracts[0];
    if (contract.status !== 'approved' && contract.status !== 'released') {
      const err = new Error('Contract must be approved to leave a review.');
      err.status = 400;
      throw err;
    }

    const freelancerId = contract.freelancer_id;

    // 2. Check if review already exists for this contract
    const [existingReviews] = await connection.execute(
      `SELECT id FROM reviews WHERE contract_id = ?`,
      [contractId]
    );

    if (existingReviews.length > 0) {
      const err = new Error('A review already exists for this contract.');
      err.status = 409;
      throw err;
    }

    // 3. Insert the new review
    await connection.execute(
      `INSERT INTO reviews (contract_id, employer_id, freelancer_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [contractId, employerId, freelancerId, rating, comment]
    );

    // 4. Calculate the new average rating
    const [aggregations] = await connection.execute(
      `SELECT AVG(rating) as new_average, COUNT(id) as total_count 
       FROM reviews 
       WHERE freelancer_id = ?`,
      [freelancerId]
    );

    const newAverage = aggregations[0].new_average || 0;
    const totalCount = aggregations[0].total_count || 0;

    // 5. Update the freelancer's profile
    await connection.execute(
      `UPDATE users SET average_rating = ?, total_reviews = ? WHERE id = ?`,
      [newAverage, totalCount, freelancerId]
    );

    // 6. Fetch updated freelancer profile
    const [freelancers] = await connection.execute(
      `SELECT id, name, average_rating, total_reviews 
       FROM users WHERE id = ?`,
      [freelancerId]
    );

    await connection.commit();
    return freelancers[0];

  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const getFreelancerReviewsService = async (freelancerId, page, limit) => {
  const offset = (page - 1) * limit;

  // 1. Get total count for pagination
  const [countResult] = await pool.execute(
    `SELECT COUNT(id) as total FROM reviews WHERE freelancer_id = ?`,
    [freelancerId]
  );
  const total = countResult[0].total;
  const total_pages = Math.ceil(total / limit);

  // 2. Fetch paginated reviews with employer name, newest first
  const [reviews] = await pool.execute(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.name as employer_name
     FROM reviews r
     JOIN users u ON r.employer_id = u.id
     WHERE r.freelancer_id = ?
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [freelancerId, limit.toString(), offset.toString()]
  );

  return {
    page,
    limit,
    total,
    total_pages,
    reviews
  };
};
