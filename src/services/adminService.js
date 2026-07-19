import AdminRepository from '../repository/adminRepository.js';

class AdminService {
    async getDashboardOverview() {
        const [
            userStats,
            jobStats,
            proposalStats,
            escrowStats
        ] = await Promise.all([
            AdminRepository.getUserStatistics(),
            AdminRepository.getJobStatistics(),
            AdminRepository.getProposalStatistics(),
            AdminRepository.getEscrowValue()
        ]);
        
        return {
            overview: {
                users: {
                    total: parseInt(userStats.total) || 0,
                    admins: parseInt(userStats.admins) || 0,
                    employers: parseInt(userStats.employers) || 0,
                    freelancers: parseInt(userStats.freelancers) || 0
                },
                jobs: parseInt(jobStats.total) || 0,
                proposals: parseInt(proposalStats.total) || 0,
                escrowValue: parseFloat(escrowStats.total) || 0
            }
        };
    }

    async getAllUsers(page = 1, limit = 10, search = '', role = '', status = '') {
        const offset = (page - 1) * limit;
        const [users, total] = await Promise.all([
            AdminRepository.getUsers(limit, offset, search, role, status),
            AdminRepository.getUsersCount(search, role, status)
        ]);

        return {
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async updateUserStatus(id, status, adminId) {
        if (id === adminId) {
            throw new Error('Admin cannot suspend himself');
        }

        const affectedRows = await AdminRepository.updateUserStatus(id, status);
        if (affectedRows === 0) {
            throw new Error('User not found');
        }

        return { status };
    }

    async getAllJobs(page = 1, limit = 10, search = '', status = '') {
        const offset = (page - 1) * limit;
        const [jobs, total] = await Promise.all([
            AdminRepository.getJobs(limit, offset, search, status),
            AdminRepository.getJobsCount(search, status)
        ]);

        return {
            data: jobs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async updateJobStatus(id, status) {
        const affectedRows = await AdminRepository.updateJobStatus(id, status);
        if (affectedRows === 0) {
            throw new Error('Job not found');
        }

        return { status };
    }

    async getJobsAnalytics() {
        const stats = await AdminRepository.getJobsPerDay();
        return stats.map(stat => ({
            date: stat.date,
            count: parseInt(stat.count)
        }));
    }
}

export default new AdminService();