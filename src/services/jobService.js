import { query } from '../config/db.js';

export const getJobs = async (filters) => {
  const { search, category, location, budget_min, budget_max, sort, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let whereClauses = [];
  let params = [];

  if (search) {
    whereClauses.push('(title LIKE ? OR description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (category) {
    whereClauses.push('category = ?');
    params.push(category);
  }

  if (location) {
    whereClauses.push('location = ?');
    params.push(location);
  }

  if (budget_min) {
    whereClauses.push('budget >= ?');
    params.push(budget_min);
  }

  if (budget_max) {
    whereClauses.push('budget <= ?');
    params.push(budget_max);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let orderBy = 'ORDER BY created_at DESC';
  if (sort === 'budget_high') {
    orderBy = 'ORDER BY budget DESC';
  } else if (sort === 'budget_low') {
    orderBy = 'ORDER BY budget ASC';
  }

  // Count query
  const countSql = `SELECT COUNT(*) as total FROM jobs ${whereString}`;
  const [countResult] = await query(countSql, params);
  const total = countResult[0].total;

  // Data query
  const dataSql = `SELECT * FROM jobs ${whereString} ${orderBy} LIMIT ? OFFSET ?`;
  // Push limit and offset as numbers (mysql2/promise handles them well if connection is configured, but strictly they should be numbers)
  const [jobs] = await query(dataSql, [...params, Number(limit), Number(offset)]);

  return {
    jobs,
    total,
    totalPages: Math.ceil(total / limit),
    page: Number(page),
    limit: Number(limit)
  };
};

export const createJob = async (jobData) => {
  const { employer_id, title, description, category, location, budget, deadline } = jobData;
  const sql = `
    INSERT INTO jobs (employer_id, title, description, category, location, budget, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [employer_id, title, description, category, location, budget, deadline];
  const [result] = await query(sql, values);
  
  const [newJob] = await query('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
  return newJob[0];
};

export const getJobById = async (id) => {
  const sql = `
    SELECT j.*, COUNT(p.id) as proposalCount 
    FROM jobs j
    LEFT JOIN proposals p ON j.id = p.job_id
    WHERE j.id = ?
    GROUP BY j.id
  `;
  const [rows] = await query(sql, [id]);
  return rows[0];
};
