import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  login: (params) => api.post(API_CONSTANTS.AUTH.LOGIN, params),

  register: (params) => api.post(API_CONSTANTS.AUTH.REGISTER, params),
};
