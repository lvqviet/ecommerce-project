const API_CONSTANTS = {
  AUTH: {
    LOGIN: "auth/signin",
    REGISTER: "auth/signup",
    // FORGOT_PASSWORD: "auth/forgot-password",
    // RESET_PASSWORD: (id) => `auth/reset-password/${id}`,
  },
  USER: {
    PROFILE: "users/me/profile",
    UPDATE_PASSWORD: "users/me/password",
  },
  PRODUCT: {
    GET: "products",
    GET_BY_ID: (id) => `products/${id}`,
  },
  CATEGORY: {
    GET: "categories",
    GET_BY_ID: (id) => `categories/${id}`,
  },
  RATING: {
    SEND: (id) => `products/${id}/ratings`,
    UPDATE: (productId, ratingId) =>
      `products/${productId}/ratings/${ratingId}`,
    DELETE: (productId, ratingId) =>
      `products/${productId}/ratings/${ratingId}`,
  },
  CART: {
    GET: "users/me/cart",
    UPDATE: "users/me/cart",
  },
  ORDER: {
    CHECKOUT: "orders",
    GET_ALL: "orders",
    GET_BY_ID: (id) => `orders/${id}`,
    CANCEL: (id) => `orders/${id}/cancel`,
    RECEIVED: (id) => `orders/${id}?status=delivered`,
  },
  VOUCHER: {
    GET: "vouchers",
  },
};

export default API_CONSTANTS;
