import api from "./apiConfig";

export const getToken = (params) => {
  return api.post("/auth/signin", params);
};
