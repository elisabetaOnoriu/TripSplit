import React from 'react';
import { useAppSelector } from '../features/store';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../features/theme';

import toggleLightIcon from '../assets/day.png';
import toggleDarkIcon from '../assets/night.png';

const ThemeSelector = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <div className='theme-toggle-button' onClick={() => dispatch(toggleTheme())} aria-label='Toggle theme'>
      <img
        className='toggle-icon'
        src={theme === 'dark' ? toggleLightIcon : toggleDarkIcon}
        alt={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      />
    </div>
  );
};

export default ThemeSelector;
