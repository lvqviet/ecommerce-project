import api from "./apiConfig";

export const getAllOrder = () => {
  return api.get("/orders");
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const updateOrder = (id, status) => {
  return api.put(`/orders/${id}?status=${status}`);
};

export const getStatistic = (from, to) => {
  return api.get(`/orders/statistic?from=${from}&to=${to}`);
};
