import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import ThemeSelector from '../ThemeSelector';

function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <ThemeSelector />

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
    </>
  );
}

export default Welcome;
