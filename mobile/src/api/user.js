import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  getProfile: () => api.get(API_CONSTANTS.USER.PROFILE),

  changePassword: (params) =>
    api.put(API_CONSTANTS.USER.UPDATE_PASSWORD, params),

  updateProfile: (params) => api.put(API_CONSTANTS.USER.PROFILE, params),
};
