import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string 
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login_: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save token and user in localStorage for persistence
      localStorage.setItem("Chat_Auth_Token", action.payload.token);
      localStorage.setItem("Chat_User", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;

      // Clear localStorage
      localStorage.removeItem("Chat_Auth_Token");
      localStorage.removeItem("Chat_User");
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("Chat_Auth_Token");
      const user = localStorage.getItem("Chat_User");

      if (token && user) {
        state.isLoggedIn = true;
        state.user = JSON.parse(user);
        state.token = token;
      }
    },
  },
});

export const { login_, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
