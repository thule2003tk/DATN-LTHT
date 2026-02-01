import axiosClient from "./axiosClient";

const khuyenMaiApi = {
    getActivePromos: () => axiosClient.get("/khuyenmai"), // Controller filters by 'Đang áp dụng'
};

export default khuyenMaiApi;
