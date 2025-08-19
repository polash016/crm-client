import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo } from "@/services/auth.service";

const initialState = {
  user: getUserInfo() || null,
  permissions: [],
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.error = null;
    },
  },
});

export const { setUser, setPermissions, setLoading, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
