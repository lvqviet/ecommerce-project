import { cartActions, cartReducers } from "./cart";
import { userActions, userReducers } from "./user";

const actions = {
  cart: cartActions,
  user: userActions,
};

const reducers = {
  cartReducers,
  userReducers,
};

export { actions, reducers };
