import AdminRepository  from '../repository/adminRepository.js'

const getDashboardOverview = async () => {
    const [
        totalUsers,
        totalJobs,
        totalProposals,
        escrowValue
    ] = await Promise.all([
        AdminRepository.getUserStatistics(),
        AdminRepository.getJobStatistics(),
        AdminRepository.getProposalStatistics(),
        AdminRepository.getEscrowValue()
    ])
    
    return {
        totalUsers,
        totalJobs,
        totalProposals,
        escrowValue
    }
}

const getAllUsers = async () => {
    const sql = `
        SELECT * FROM USERS`
}

export default getDashboardOverview;