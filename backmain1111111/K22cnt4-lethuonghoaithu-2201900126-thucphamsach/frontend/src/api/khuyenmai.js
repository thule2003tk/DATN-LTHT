import axiosClient from "./axiosClient";

const khuyenMaiApi = {
    getActivePromos: () => axiosClient.get("/khuyenmai"), // Controller filters by 'Đang áp dụng'
    savePromo: (ma_km) => axiosClient.post("/khuyenmai/save", { ma_km }),
    getMinePromos: () => axiosClient.get("/khuyenmai/mine"),
};

export default khuyenMaiApi;
