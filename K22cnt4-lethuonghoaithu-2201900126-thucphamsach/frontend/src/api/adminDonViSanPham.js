import axios from "axios";

const API = "http://localhost:3001/api/admin/donvisanpham";

export const getDonViSanPham = async () => {
    const res = await axios.get(API);
    return res.data;
};

export const addDonViSanPham = async (data) => {
    return axios.post(API, data);
};

export const updateDonViSanPham = async (id, data) => {
    return axios.put(`${API}/${id}`, data);
};

export const deleteDonViSanPham = async (id) => {
    return axios.delete(`${API}/${id}`);
};
