import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';

function AccountValidated() {
  const navigate = useNavigate();

  return (
    <>
      <ThemeSelector />

      <h1 className='header'>🤩Your account has been validated. Please return to login.🤩</h1>

    </>
  );
}

export default AccountValidated;
