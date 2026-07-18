import {query} from '../config/db.js'

class AdminRepository{

     // function to get user statistics for the admin dashboard
      async getUserStatistics() {
            const sql = `
                SELECT
                    COUNT(*)::INT AS total_users,
                    COUNT(*) FILTER (WHERE role = 'admin') AS admin,
                    COUNT(*) FILTER (WHERE role = 'freelancer') AS freelancer,
                    COUNT(*) FILTER (WHERE role = 'employer') AS employer
                FROM users;
            `;
            const [result] = await query(sql);
            return result[0];
        }
    
        // function to get job statistics for the admin dashboard
        async getJobStatistics() {
            const sql = `
                SELECT
                    COUNT(*)::INT AS total_jobs,
                    COUNT(*) FILTER (WHERE status = 'open') AS open,
                    COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
                    COUNT(*) FILTER (WHERE status = 'completed') AS completed,
                    COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
                FROM jobs;
            `;
            const [result] = await query(sql);
            return result[0];
        }
    
        // function to get contract statistics for the admin dashboard
        async getContractStatistics() {
            const sql = `
                SELECT
                    COUNT(*)::INT AS total_contracts,
                    COUNT(*) FILTER (WHERE status = 'pending') AS pending,
                    COUNT(*) FILTER (WHERE status = 'active') AS active,
                    COUNT(*) FILTER (WHERE status = 'completed') AS completed,
                    COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
                FROM contracts;
            `;
            const [result] = await query(sql);
            return result[0];
        }
    
        // function to get escrow statistics for the admin dashboard
        async getEscrowStatistics() {
            const sql = `
                SELECT
                    COUNT(*)::INT AS total_escrows,
                    COUNT(*) FILTER (WHERE status = 'funded') AS funded,
                    COUNT(*) FILTER (WHERE status = 'released') AS released,
                    COUNT(*) FILTER (WHERE status = 'disputed') AS disputed
                FROM escrow;
            `;
            const [result] = await query(sql);
            return result[0];
        }
        // function to get total proposal
        async getTotalProposals(){
            const sql =`
                SELECT 
                    COUNT(*):: INT AS total_proposals
                FROM proposals
            `;
            const [result] = await query(sql);
            return result[0];
        }
    
        // get jobs per day
        async jobsPerDay() {
            const sql = `
                SELECT 
                    DATE(created_at) AS date,
                    COUNT(*)::INT AS job_count
                FROM jobs
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `;
            const [result] = await query(sql);
            return result;
        }

}

export default new AdminRepository;