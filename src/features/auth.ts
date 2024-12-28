import { createSlice } from '@reduxjs/toolkit';
import { api } from './api';

type AuthState = {
  token?: string;
  userId?: string;
};

const initialState: AuthState = {
  token: undefined,
  userId: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = undefined;
      state.userId = undefined;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
      // TODO: Token
      state.token = payload.token;
      state.userId = payload.user.id;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
