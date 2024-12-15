import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Login.css'; // Reusing the same CSS
import toggleLightIcon from '../../assets/day.png';
import toggleDarkIcon from '../../assets/night.png';
import { useLoginMutation } from '../../features/api';

function Login() {
  const [email, setEmail] = useState('razvancristian12@gmail.com');
  const [password, setPassword] = useState('123dAsd!');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [login] = useLoginMutation();

  // useNavigate hook for navigating to the Navbar page
  const navigate = useNavigate();

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme); // Save theme preference
  };

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Not a valid email address.');
    } else {
      setEmailError('');
      const postdata = {
        email: email,
        password: password,
      };

      let res = await login(postdata);
      if ('error' in res && res.error) {
        setEmailError(res.error?.message!);
        return;
      }

      navigate('/home');
    }
  };

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Theme Toggle Button */}
      <div className='theme-toggle-button' onClick={toggleTheme} aria-label='Toggle theme'>
        <img
          className='toggle-icon'
          src={isDarkMode ? toggleLightIcon : toggleDarkIcon}
          alt={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        />
      </div>

      <form className='form' onSubmit={handleSubmit}>
        <h1 className='header'>Login</h1>

        {/* Email Field */}
        <div className='input-container'>
          <input
            className='input'
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setEmailError('')}
            onBlur={() => {
              if (!validateEmail(email)) {
                setEmailError('Incorrect e-mail address');
              }
            }}
            required
          />
        </div>
        {emailError && <div className='error-message'>{emailError}</div>}

        {/* Password Field */}
        <div className='input-container'>
          <input
            className='input'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div
            className='toggle-password-button'
            onClick={() => setShowPassword(!showPassword)}
            role='button'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash style={{ color: 'black' }} /> : <FaEye style={{ color: 'black' }} />}
          </div>
        </div>

        {/* Submit Button */}
        <button
          className='submit-button'
          type='submit'
          style={{
            backgroundColor: isDarkMode ? 'black' : 'white',
            color: isDarkMode ? 'white' : 'black',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
