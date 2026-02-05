import axiosClient from "./axiosClient";

const API = "/danhmuc";

export const getDanhMuc = async () => {
    const res = await axiosClient.get(API);
    return res.data;
};
