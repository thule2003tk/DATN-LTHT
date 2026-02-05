import axiosClient from "./axiosClient";

const API = "/khachhang";

export const getCustomers = async () => {
    const res = await axiosClient.get(API);
    return res.data;
};

export const updateCustomerStatus = async (ma_kh, trangthai) => {
    const res = await axiosClient.put(`${API}/${ma_kh}/status`, { trangthai });
    return res.data;
};

export const updateCustomer = async (ma_kh, data) => {
    const res = await axiosClient.put(`${API}/${ma_kh}`, data);
    return res.data;
};
