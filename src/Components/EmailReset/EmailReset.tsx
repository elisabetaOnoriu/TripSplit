import React, { useState, useEffect } from 'react';
import './EmailReset.css'; 
import toggleLightIcon from '../../assets/day.png';
import toggleDarkIcon from '../../assets/night.png';
import { useNavigate } from 'react-router-dom';

function EmailReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailError && email) {
      console.log('Email submitted:', email);
      navigate('/login');
    } else {
      console.log('Form submission failed. Validation errors present.');
    }
  };

  const isFormValid = () => email && !emailError;

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='theme-toggle-button' onClick={toggleTheme}>
        <img
          className='toggle-icon'
          src={isDarkMode ? toggleLightIcon : toggleDarkIcon}
          alt={isDarkMode ? 'Light mode' : 'Dark mode'}
        />
      </div>

      <form className='form' onSubmit={handleSubmit}>
        <h1 className='header'>Enter Your Email</h1>

        <div className='input-container'>
          <input
            className='input'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
        </div>
        {emailError && <div className='error-message'>{emailError}</div>}

        <button
          className='submit-button'
          type='submit'
          style={{
            backgroundColor: isDarkMode ? 'black' : 'white',
            color: isDarkMode ? 'white' : 'black',
            opacity: isFormValid() ? 1 : 0.6,
            cursor: isFormValid() ? 'pointer' : 'not-allowed',
          }}
          disabled={!isFormValid()}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default EmailReset;
