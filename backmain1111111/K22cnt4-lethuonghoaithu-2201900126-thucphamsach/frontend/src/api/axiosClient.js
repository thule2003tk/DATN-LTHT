import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/api",
});

// 👉 TỰ ĐỘNG GẮN TOKEN
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
