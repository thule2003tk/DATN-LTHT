import axios from "axios";

const API = "http://localhost:3001/api/admin/donvitinh";

export const getDonViTinh = async () => {
    const res = await axios.get(API);
    return res.data;
};

export const getDonViTinhById = async (id) => {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
};

export const addDonViTinh = async (data) => {
    return axios.post(API, data);
};

export const updateDonViTinh = async (id, data) => {
    return axios.put(`${API}/${id}`, data);
};

export const deleteDonViTinh = async (id) => {
    return axios.delete(`${API}/${id}`);
};
