import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  checkout: (params) => api.post(API_CONSTANTS.ORDER.CHECKOUT, params),

  cancel: (id) => api.put(API_CONSTANTS.ORDER.CANCEL(id)),

  getAll: () => api.get(API_CONSTANTS.ORDER.GET_ALL),

  getById: (id) => api.get(API_CONSTANTS.ORDER.GET_BY_ID(id)),

  received: (id) => api.put(API_CONSTANTS.ORDER.RECEIVED(id)),

  getVoucher: () => api.get(API_CONSTANTS.VOUCHER.GET),
};
