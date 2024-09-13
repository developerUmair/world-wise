import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../featues/Auth/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
