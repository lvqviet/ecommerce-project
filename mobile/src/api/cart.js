import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  get: () => api.get(API_CONSTANTS.CART.GET),

  update: (params) => api.put(API_CONSTANTS.CART.UPDATE, params),
};
