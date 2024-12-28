import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ResetPassword.css'; 
import toggleLightIcon from '../../assets/day.png';
import toggleDarkIcon from '../../assets/night.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../../features/api';

const Criteria = ({ met, children }: { met: boolean; children: React.ReactNode }) => (
  <div style={{ color: met ? 'green' : 'red', fontSize: '0.9rem' }}>
    {met ? '✔️' : '❌'} {children}
  </div>
);

const Tooltip = ({ children }: { children: React.ReactNode }) => <div className='tooltip'>{children}</div>;

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
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
      const params = new URLSearchParams(location.search);
      const token = params.get('resetToken') || '';
      const userId = params.get('id') || '';

      const postData = {
        userId: userId,
        token: token,
        password: password,
      };

      let res = await resetPassword(postData);
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
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='theme-toggle-button' onClick={toggleTheme}>
        <img
          className='toggle-icon'
          src={isDarkMode ? toggleLightIcon : toggleDarkIcon}
          alt={isDarkMode ? 'Light mode' : 'Dark mode'}
        />
      </div>

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

export default ResetPassword;
