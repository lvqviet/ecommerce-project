import api from "./apiConfig";

export const getAllUser = () => {
  return api.get("/users");
};

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const updateUser = (id, params) => {
  return api.put(`/users/${id}`, params);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
