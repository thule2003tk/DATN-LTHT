import axiosClient from "./axiosClient";

const adminSupplierApi = {
    getAll: () => axiosClient.get("/admin/suppliers"),
    create: (data) => axiosClient.post("/admin/suppliers", data),
    update: (ma_ncc, data) => axiosClient.put(`/admin/suppliers/${ma_ncc}`, data),
    delete: (ma_ncc) => axiosClient.delete(`/admin/suppliers/${ma_ncc}`),
};

export default adminSupplierApi;
