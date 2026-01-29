import axios from "axios";

const API = "http://localhost:3001/api/admin/danhmuc";

export const getDanhMuc = async () => {
    const res = await axios.get(API);
    return res.data;
};

export const getDanhMucById = async (id) => {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
};

export const addDanhMuc = async (data) => {
    return axios.post(API, data);
};

export const updateDanhMuc = async (id, data) => {
    return axios.put(`${API}/${id}`, data);
};

export const deleteDanhMuc = async (id) => {
    return axios.delete(`${API}/${id}`);
};
