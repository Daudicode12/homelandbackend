import getDashboardOverview  from "../services/adminService.js";

const getDashboard = async(req, res) =>{
    try {
        const dashboardData = await getDashboardOverview();
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// getting all the users
export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getDashboard, getAllUsers };