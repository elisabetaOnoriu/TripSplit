import { createSlice } from '@reduxjs/toolkit';

type ThemeState = {
  theme: 'light' | 'dark';
};

const initialState: ThemeState = {
  theme: 'dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: state => {
      if (state.theme === 'dark') {
        state.theme = 'light';
      } else {
        state.theme = 'dark';
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
