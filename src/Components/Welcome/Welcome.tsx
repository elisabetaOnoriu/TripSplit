import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import toggleLightIcon from '../../assets/day.png';
import toggleDarkIcon from '../../assets/night.png';

function Welcome({ theme, setTheme }) {
  const navigate = useNavigate();

  // Toggle theme and save preference
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <div className={`container ${theme}`}>
      {/* Theme Toggle Button moved to the top right */}
      <div className='theme-toggle-button' onClick={toggleTheme}>
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
