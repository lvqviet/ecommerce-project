import api from "./apiConfig";

export const getAllVoucher = () => {
  return api.get("/vouchers");
};

export const getVoucherById = (id) => {
  return api.get(`/vouchers/${id}`);
};

export const updateVoucher = (id, params) => {
  return api.put(`/vouchers/${id}`, params);
};

export const deleteVoucher = (id) => {
  return api.delete(`/vouchers/${id}`);
};

export const createVoucher = (params) => {
  return api.post(`/vouchers`, params);
};
