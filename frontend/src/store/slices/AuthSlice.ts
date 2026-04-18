import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  name: string;
  email: string;
  password: string | null;
  avatar: string | null;
  auth_provider: "local" | "google" | "github";
  default_currency: string;
  token_version: number;
}

interface AuthState {
  access_token: string | null;
  user: User | null;
}

const intialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: intialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.access_token = null;
      state.user = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
});

export const { clearAuth, setAuth } = authSlice.actions;
export default authSlice.reducer;
