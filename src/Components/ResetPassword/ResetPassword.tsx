import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ResetPassword.css';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../ThemeSelector';
import { useAppSelector } from '../../features/store';

const Criteria = ({ met, children }: { met: boolean; children: React.ReactNode }) => (
  <div style={{ color: met ? 'green' : 'red', fontSize: '0.9rem' }}>
    {met ? '✔️' : '❌'} {children}
  </div>
);

const Tooltip = ({ children }: { children: React.ReactNode }) => <div className='tooltip'>{children}</div>;

function ResetPassword() {
  const theme = useAppSelector(state => state.theme.theme);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordCriteriaError, setPasswordCriteriaError] = useState('');

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    const criteria = {
      length: value.length >= 8 && !value.includes(' '),
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!#$^*.]/.test(value),
    };

    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setPasswordError('Password does not meet all criteria');
      valid = false;
    }

    if (password !== confirmPassword) {
      setPasswordCriteriaError('Passwords do not match!');
      valid = false;
    }

    if (valid) {
      console.log('Form submitted successfully!');
      navigate('/login');
    } else {
      console.log('Form submission failed. Validation errors present.');
    }
  };

  const isFormValid = () => {
    return (
      password &&
      confirmPassword &&
      password === confirmPassword &&
      Object.values(passwordCriteria).every(Boolean) &&
      !passwordError &&
      !passwordCriteriaError
    );
  };

  return (
    <>
      <ThemeSelector />

      <form className='form' onSubmit={handleSubmit}>
        <h1 className='header'>Reset Password</h1>

        <div className='input-container'>
          <input
            className='input'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={e => handlePasswordChange(e.target.value)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
          />
          <div className='toggle-password-button' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash style={{ color: 'black' }} /> : <FaEye style={{ color: 'black' }} />}
          </div>
        </div>
        {showTooltip && (
          <Tooltip>
            <Criteria met={passwordCriteria.length}>At least 8 characters with no space</Criteria>
            <Criteria met={passwordCriteria.uppercase}>At least 1 uppercase letter</Criteria>
            <Criteria met={passwordCriteria.number}>At least 1 number</Criteria>
            <Criteria met={passwordCriteria.specialChar}>
              At least 1 of the following special characters: ! # $ ^ *
            </Criteria>
          </Tooltip>
        )}
        {passwordError && <div className='error-message'>{passwordError}</div>}

        <div className='input-container'>
          <input
            className='input'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <div className='toggle-password-button' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash style={{ color: 'black' }} /> : <FaEye style={{ color: 'black' }} />}
          </div>
        </div>
        {passwordCriteriaError && <div className='error-message'>{passwordCriteriaError}</div>}

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

export default ResetPassword;
