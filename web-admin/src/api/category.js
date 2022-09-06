import api from "./apiConfig";

export const getAllCategory = () => {
  return api.get("/categories");
};

export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

export const updateCategory = (id, params) => {
  return api.patch(`/categories/${id}`, params);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

export const createCategory = (params) => {
  return api.post(`/categories`, params);
};
