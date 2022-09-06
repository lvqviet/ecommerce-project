import api from "./apiConfig";

export const getAllProducts = () => {
  return api.get("/products");
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const updateProduct = (id, params) => {
  return api.put(`/products/${id}`, params);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export const createProduct = (params) => {
  return api.post(`/products`, params);
};
