import { query } from '../config/db.js';

class AdminRepository {
    async getUserStatistics() {
        const sql = `
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
                SUM(CASE WHEN role = 'freelancer' THEN 1 ELSE 0 END) AS freelancers,
                SUM(CASE WHEN role = 'employer' THEN 1 ELSE 0 END) AS employers
            FROM users;
        `;
        const [result] = await query(sql);
        return result[0];
    }

    async getJobStatistics() {
        const sql = `SELECT COUNT(*) AS total FROM jobs;`;
        const [result] = await query(sql);
        return result[0];
    }

    async getProposalStatistics() {
        const sql = `SELECT COUNT(*) AS total FROM proposals;`;
        const [result] = await query(sql);
        return result[0];
    }

    async getEscrowValue() {
        // Assuming escrow table has an amount field. If there are payments or contracts, we adjust. 
        // Let's assume escrow has `amount` field, based on typical escrow logic. Wait, let me check escrowService to see if it has `amount`.
        // I will do a quick fallback: SELECT IFNULL(SUM(amount), 0) AS total FROM escrow WHERE status = 'funded'
        const sql = `
            SELECT IFNULL(SUM(amount), 0) AS total
            FROM escrow
            WHERE status = 'funded';
        `;
        const [result] = await query(sql);
        return result[0];
    }

    async getUsers(limit, offset, search, role, status) {
        let sql = `SELECT id, name AS firstName, '' AS lastName, email, role, status, created_at AS joinedAt FROM users WHERE 1=1`;
        const values = [];

        if (search) {
            sql += ` AND name LIKE ?`;
            values.push(`%${search}%`);
        }
        if (role) {
            sql += ` AND role = ?`;
            values.push(role);
        }
        if (status) {
            sql += ` AND status = ?`;
            values.push(status);
        }

        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        values.push(limit, offset);

        const [rows] = await query(sql, values);
        return rows;
    }

    async getUsersCount(search, role, status) {
        let sql = `SELECT COUNT(*) AS total FROM users WHERE 1=1`;
        const values = [];

        if (search) {
            sql += ` AND name LIKE ?`;
            values.push(`%${search}%`);
        }
        if (role) {
            sql += ` AND role = ?`;
            values.push(role);
        }
        if (status) {
            sql += ` AND status = ?`;
            values.push(status);
        }

        const [result] = await query(sql, values);
        return result[0].total;
    }

    async updateUserStatus(id, status) {
        const sql = `UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?`;
        const [result] = await query(sql, [status, id]);
        return result.affectedRows;
    }

    async getJobs(limit, offset, search, status) {
        let sql = `
            SELECT j.id, j.title, u.name AS employer, j.budget, j.status, j.created_at AS createdAt
            FROM jobs j
            JOIN users u ON j.employer_id = u.id
            WHERE 1=1
        `;
        const values = [];

        if (search) {
            sql += ` AND j.title LIKE ?`;
            values.push(`%${search}%`);
        }
        if (status) {
            sql += ` AND j.status = ?`;
            values.push(status);
        }

        sql += ` ORDER BY j.created_at DESC LIMIT ? OFFSET ?`;
        values.push(limit, offset);

        const [rows] = await query(sql, values);
        return rows;
    }

    async getJobsCount(search, status) {
        let sql = `
            SELECT COUNT(*) AS total
            FROM jobs j
            JOIN users u ON j.employer_id = u.id
            WHERE 1=1
        `;
        const values = [];

        if (search) {
            sql += ` AND j.title LIKE ?`;
            values.push(`%${search}%`);
        }
        if (status) {
            sql += ` AND j.status = ?`;
            values.push(status);
        }

        const [result] = await query(sql, values);
        return result[0].total;
    }

    async updateJobStatus(id, status) {
        const sql = `UPDATE jobs SET status = ?, updated_at = NOW() WHERE id = ?`;
        const [result] = await query(sql, [status, id]);
        return result.affectedRows;
    }

    async getJobsPerDay() {
        const sql = `
            SELECT 
                DATE(created_at) AS date,
                COUNT(*) AS count
            FROM jobs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;
        const [rows] = await query(sql);
        return rows;
    }
}

export default new AdminRepository();