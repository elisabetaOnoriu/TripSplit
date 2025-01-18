import React, { useState } from 'react';
import './AuthenticatorCode.css';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../ThemeSelector';
import { useAppSelector } from '../../features/store';

function AuthenticatorCode() {
  const theme = useAppSelector(state => state.theme.theme);
  const navigate = useNavigate();
  const [codeAuth, setCodeAuth] = useState('');
  const [codeError, setCodeError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!codeError && codeAuth) {
      console.log('Code submitted:', codeAuth);
      setPopupVisible(true); 
    } else {
      console.log('Form submission failed. Validation errors present.');
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    
    navigate('/home'); 
  };

  const isFormValid = () => codeAuth && !codeError;

  return (
    <>
      <ThemeSelector />

      <form className='form' onSubmit={handleSubmit}>
        <h1 className='header'>Enter your authentication code</h1>

        <div className='input-container'>
          <input
            className='input'
            type='string'
            placeholder='Enter your authentification code'
            value={codeAuth}
          />
        </div>
        {codeError && <div className='error-message'>{codeError}</div>}

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

      {popupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <p>You have succesfully logged in!</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthenticatorCode;
