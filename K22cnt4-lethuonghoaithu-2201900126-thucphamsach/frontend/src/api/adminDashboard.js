import axiosClient from "./axiosClient";

const adminDashboardApi = {
    getRevenueWeek: () => axiosClient.get("/admin/revenue-week"),
    getSummary: () => axiosClient.get("/admin/summary"),
    getOrderStatus: () => axiosClient.get("/admin/order-status"),
    getTopProducts: () => axiosClient.get("/admin/top-products"),
};

export default adminDashboardApi;
