import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// const isAuthenticated = Cookies.get('access_token') ? true : false

const emptyUser = {
  username: "",
  full_name: "",
  id: "",
  role: "",
};
interface user {
  id: string;
  full_name: string;
  username: string;
  role: string;
}
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: user;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: emptyUser,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
      if (state.isLoading) state.isLoading = false;
    },

    setLogout: (state) => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      state.user = emptyUser;

      state.isAuthenticated = false;
      state.isLoading = false;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setAuth, setLogout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
