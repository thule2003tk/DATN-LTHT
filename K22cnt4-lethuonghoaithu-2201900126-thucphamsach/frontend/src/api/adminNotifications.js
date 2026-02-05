import axiosClient from "./axiosClient";

const adminNotificationApi = {
    getNotifications: (params = {}) => {
        return axiosClient.get("/admin/notifications", { params });
    },
};

export default adminNotificationApi;
