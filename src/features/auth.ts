import { createSlice } from '@reduxjs/toolkit';
import { api } from './api';

type AuthState = {
  token?: string;
};

const initialState: AuthState = {
  token: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = undefined;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
      // TODO: Token
      state.token = payload.token;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
