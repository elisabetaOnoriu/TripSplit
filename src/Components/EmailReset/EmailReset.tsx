import React, { useState } from 'react';
import './EmailReset.css';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../ThemeSelector';
import { useAppSelector } from '../../features/store';

function EmailReset() {
  const theme = useAppSelector(state => state.theme.theme);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    <>
      <ThemeSelector />

      <form className='form' onSubmit={handleSubmit}>
        <h1 className='header'>Enter Your Email</h1>

        <div className='input-container'>
          <input
            className='input'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={e => handleEmailChange(e.target.value)}
          />
        </div>
        {emailError && <div className='error-message'>{emailError}</div>}

        <button
          className='submit-button'
          type='submit'
          style={{
            backgroundColor: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
            opacity: isFormValid() ? 1 : 0.6,
            cursor: isFormValid() ? 'pointer' : 'not-allowed',
          }}
          disabled={!isFormValid()}
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default EmailReset;
