import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useLoginMutation } from '../../features/api';
import { useAppSelector } from '../../features/store';
import ThemeSelector from '../ThemeSelector';

function Login() {
  const theme = useAppSelector(state => state.theme.theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [login] = useLoginMutation();

  const navigate = useNavigate();

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
    <>
      <ThemeSelector />

      <form className='form' onSubmit={handleSubmit}>
        <h1 className='header'>Login</h1>

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

        <div className='text-container'>
          <p className='normal-text'>Forgot your password?</p>
          <span
            className='clickable-text'
            onClick={() => navigate('/EmailReset')}
            role='button'
            style={{ cursor: 'pointer', textDecoration: 'underline', color: theme === 'dark' ? 'lightblue' : 'blue' }}
          >
            Reset password
          </span>
        </div>

        <button
          className='submit-button'
          type='submit'
          style={{
            backgroundColor: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default Login;
