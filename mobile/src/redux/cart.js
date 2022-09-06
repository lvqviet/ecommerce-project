import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    get_cart: (state, action) => {
      const { items } = action.payload;
      let totalQuantity = 0,
        totalPrice = 0;

      return { ...state, totalQuantity, totalPrice, items };
    },
    add_to_cart: (state, action) => {
      const { product, quantity } = action.payload;
      let cloneItems = [...state.items];
      const findIndex = state.items.findIndex(
        (e) => e.product._id == product._id
      );

      if (findIndex == -1) {
        cloneItems.push({ product, quantity });
      } else {
        cloneItems = cloneItems.map((item, index) => {
          if (findIndex == index)
            return { ...item, quantity: item.quantity + quantity };
          return item;
        });
      }

      return { ...state, items: cloneItems };
    },
    delete_item: (state, action) => {
      const { item } = action.payload;
      const cloneItems = state.items.filter(
        (e) => e.product._id != item.product._id
      );

      if (item.isSelected) {
        const totalQuantity = state.totalQuantity - item.quantity;
        const totalPrice =
          state.totalPrice - item.quantity * item.product.price;
        return { ...state, totalQuantity, totalPrice, items: cloneItems };
      }

      return { ...state, items: cloneItems };
    },
    increase_amount: (state, action) => {
      const { item } = action.payload;
      const cloneItems = state.items.map((e) => {
        if (e.product._id == item.product._id)
          return { ...e, quantity: e.quantity + 1 };
        return e;
      });

      if (item.isSelected) {
        const totalQuantity = state.totalQuantity + 1;
        const totalPrice = state.totalPrice + item.product.price;
        return { ...state, totalQuantity, totalPrice, items: cloneItems };
      }

      return { ...state, items: cloneItems };
    },
    decrease_amount: (state, action) => {
      const { item } = action.payload;
      const cloneItems = state.items.map((e) => {
        if (e.product._id == item.product._id)
          return { ...e, quantity: e.quantity - 1 };
        return e;
      });

      if (item.isSelected) {
        const totalQuantity = state.totalQuantity - 1;
        const totalPrice = state.totalPrice - item.product.price;
        return { ...state, totalQuantity, totalPrice, items: cloneItems };
      }

      return { ...state, items: cloneItems };
    },
    select: (state, action) => {
      const { item } = action.payload;
      const cloneItems = state.items.map((e) => {
        if (e.product._id == item.product._id)
          return { ...e, isSelected: true };
        return e;
      });

      const totalQuantity = state.totalQuantity + item.quantity;
      const totalPrice = state.totalPrice + item.product.price * item.quantity;

      return { ...state, totalQuantity, totalPrice, items: cloneItems };
    },
    unselect: (state, action) => {
      const { item } = action.payload;
      const cloneItems = state.items.map((e) => {
        if (e.product._id == item.product._id)
          return { ...e, isSelected: false };
        return e;
      });

      const totalQuantity = state.totalQuantity - item.quantity;
      const totalPrice = state.totalPrice - item.product.price * item.quantity;

      return { ...state, totalQuantity, totalPrice, items: cloneItems };
    },
    clear: (state, action) => {
      return { ...state, items: [], totalQuantity: 0, totalPrice: 0 };
    },
    checkout: (state, action) => {
      const { cartItems } = action.payload;
      const cloneItems = state.items.filter(
        (e, index) => !cartItems.includes(index)
      );

      return { ...state, items: cloneItems, totalQuantity: 0, totalPrice: 0 };
    },
  },
});

export const cartActions = slice.actions;
export const cartReducers = slice.reducer;
