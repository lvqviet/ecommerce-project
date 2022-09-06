import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./index";

const rootReducer = {
  cart: reducers.cartReducers,
  user: reducers.userReducers,
};

const store = configureStore({
  reducer: rootReducer,
});

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

export default store;
