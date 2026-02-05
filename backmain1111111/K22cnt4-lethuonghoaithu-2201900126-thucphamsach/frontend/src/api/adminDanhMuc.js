import axiosClient from "./axiosClient";

const API = "/admin/danhmuc";

export const getDanhMuc = async () => {
    const res = await axiosClient.get(API);
    return res.data;
};

export const getDanhMucById = async (id) => {
    const res = await axiosClient.get(`${API}/${id}`);
    return res.data;
};

export const addDanhMuc = async (data) => {
    return axiosClient.post(API, data);
};

export const updateDanhMuc = async (id, data) => {
    return axiosClient.put(`${API}/${id}`, data);
};

export const deleteDanhMuc = async (id) => {
    return axiosClient.delete(`${API}/${id}`);
};
