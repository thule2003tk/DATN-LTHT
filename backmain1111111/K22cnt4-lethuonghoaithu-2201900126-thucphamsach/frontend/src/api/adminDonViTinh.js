import axiosClient from "./axiosClient";

const API = "/admin/donvitinh";

export const getDonViTinh = async () => {
    const res = await axiosClient.get(API);
    return res.data;
};

export const getDonViTinhById = async (id) => {
    const res = await axiosClient.get(`${API}/${id}`);
    return res.data;
};

export const addDonViTinh = async (data) => {
    return axiosClient.post(API, data);
};

export const updateDonViTinh = async (id, data) => {
    return axiosClient.put(`${API}/${id}`, data);
};

export const deleteDonViTinh = async (id) => {
    return axiosClient.delete(`${API}/${id}`);
};
