import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  getProducts: () => api.get(API_CONSTANTS.PRODUCT.GET),

  getById: (id) => api.get(API_CONSTANTS.PRODUCT.GET_BY_ID(id)),

  getCategories: () => api.get(API_CONSTANTS.CATEGORY.GET),

  getCategoryById: (id) => api.get(API_CONSTANTS.CATEGORY.GET_BY_ID(id)),

  sendRating: (id, params) => api.post(API_CONSTANTS.RATING.SEND(id), params),

  updateRating: (productId, ratingId, params) =>
    api.put(API_CONSTANTS.RATING.UPDATE(productId, ratingId), params),

  deleteRating: (productId, ratingId) =>
    api.delete(API_CONSTANTS.RATING.DELETE(productId, ratingId)),
};
