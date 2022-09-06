import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  isLogin: false,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // const { id, email, avatar, userName, fullName, contact, address } =
      //   action.payload;

      return {
        ...state,
        isLogin: true,
        // id,
        // email,
        // avatar,
        // userName,
        // fullName,
        // contact,
        // address,
      };
    },
    logout: (state, action) => {
      return { ...state, isLogin: false };
    },
    update_info: (state, action) => {
      const { firstName, lastName } = action.payload;

      return { ...state, firstName, lastName };
    },
  },
});

export const userActions = slice.actions;
export const userReducers = slice.reducer;
