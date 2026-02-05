import axiosClient from "./axiosClient";

const lienHeApi = {
  getAllContacts: () => {
    return axiosClient.get("/lienhe");
  },
  createContact: (data) => {
    return axiosClient.post("/lienhe", data);
  },
  replyContact: (id, data) => {
    return axiosClient.put(`/lienhe/${id}`, data);
  },
  deleteContact: (id) => {
    return axiosClient.delete(`/lienhe/${id}`);
  },
};

export default lienHeApi;
