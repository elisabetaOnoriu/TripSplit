import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import toggleLightIcon from '../../assets/day.png';
import toggleDarkIcon from '../../assets/night.png';
import { useAppSelector } from '../../features/store';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../features/theme';

function Welcome() {
  const theme = useAppSelector(state => state.theme.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={`container ${theme}`}>
      <div className='theme-toggle-button' onClick={() => dispatch(toggleTheme())}>
        <img
          className='toggle-icon'
          src={theme === 'light' ? toggleDarkIcon : toggleLightIcon}
          alt={theme === 'light' ? 'Light mode' : 'Dark mode'}
        />
      </div>

      <h1 className='header'>Trip Split</h1>
      <button className='button' onClick={() => navigate('/register')}>
        Register
      </button>
      <div className='text-container'>
        <p className='normal-text'>Already have an account?</p>
        <span className='clickable-text' onClick={() => navigate('/login')}>
          Login
        </span>
      </div>
    </div>
  );
}

export default Welcome;
