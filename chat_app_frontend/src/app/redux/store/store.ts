import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // For accessing state types
export type AppDispatch = typeof store.dispatch; // For dispatch types
export default store;
