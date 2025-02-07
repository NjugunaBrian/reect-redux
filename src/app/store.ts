import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },

  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(apiSlice.middleware), //Needed for RTK query to cache our results
  
  devTools: true, //if in production, switch to false
});

export type RootState = ReturnType<typeof store.getState>;

