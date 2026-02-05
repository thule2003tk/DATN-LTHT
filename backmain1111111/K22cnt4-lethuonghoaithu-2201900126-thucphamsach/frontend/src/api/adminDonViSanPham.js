import axiosClient from "./axiosClient";

const API = "/admin/donvisanpham";

export const getDonViSanPham = async () => {
    const res = await axiosClient.get(API);
    return res.data;
};

export const addDonViSanPham = async (data) => {
    return axiosClient.post(API, data);
};

export const updateDonViSanPham = async (id, data) => {
    return axiosClient.put(`${API}/${id}`, data);
};

export const deleteDonViSanPham = async (id) => {
    return axiosClient.delete(`${API}/${id}`);
};

export const getDonViSanPhamByMaSP = async (ma_sp) => {
    const res = await axiosClient.get(`${API}/sanpham/${ma_sp}`);
    return res.data;
};
