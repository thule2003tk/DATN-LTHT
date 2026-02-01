import axiosClient from "./axiosClient";

const adminPromotionApi = {
    getAll: () => axiosClient.get("/khuyenmai"), // Existing route allows getting all/active based on controller
    create: (data) => axiosClient.post("/khuyenmai", data),
    update: (ma_km, data) => axiosClient.put(`/khuyenmai/${ma_km}`, data),
    delete: (ma_km) => axiosClient.delete(`/khuyenmai/${ma_km}`),
};

export default adminPromotionApi;
