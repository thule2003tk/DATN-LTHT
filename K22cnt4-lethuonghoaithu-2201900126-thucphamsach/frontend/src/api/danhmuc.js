import axios from "axios";

const API = "http://localhost:3001/api/admin/danhmuc"; // Using the existing admin endpoint which is currently public

export const getDanhMuc = async () => {
    const res = await axios.get(API);
    return res.data;
};
