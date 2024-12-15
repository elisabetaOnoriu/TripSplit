import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import './Register.css';
import toggleLightIcon from '../../assets/day.png';
import toggleDarkIcon from '../../assets/night.png';

const Criteria = ({ met, children }) => (
  <div style={{ color: met ? 'green' : 'red', fontSize: '0.9rem' }}>
    {met ? '✔️' : '❌'} {children}
  </div>
);

const Tooltip = ({ children }) => (
  <div className="tooltip">
    {children}
  </div>
);

function Register() {
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCriteriaError, setPasswordCriteriaError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateName = (name) => /^[A-Z]/.test(name);

  const handlePasswordChange = (value) => {
    setPassword(value);

    const criteria = {
      length: value.length >= 8 && !value.includes(' '),
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!#$^*.]/.test(value),
    };

    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Incorrect e-mail address');
      valid = false;
    }

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setPasswordError('Password does not meet all criteria');
      valid = false;
    }

    if (password !== confirmPassword) {
      setPasswordCriteriaError('Passwords do not match!');
      valid = false;
    }

    if (!validateName(firstName)) {
      setFirstNameError('First name must start with a capital letter');
      valid = false;
    }

    if (!validateName(lastName)) {
      setLastNameError('Last name must start with a capital letter');
      valid = false;
    }

    if (valid) {
      console.log('Form submitted successfully!');
      navigate('/login'); // Navigate to login page after successful registration
    } else {
      console.log('Form submission failed. Validation errors present.');
    }
    if (valid) {
      const postdata = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
      }
      console.log(postdata); // Log postdata to verify it contains all fields
      try {
        const response = await fetch('https://localhost:7083/api/Authentication/register', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postdata),
        });
        if (!response.ok) {
          const resBody = await response.json();
          setResponseError(resBody.message || 'Account already exists');
        } else {
          setResponseError('')
          navigate('/login');
        }
      } catch (error) {
        setResponseError('Account already exists');
      }
    }
  };

  const isFormValid = () => {
    return (
      firstName && 
      lastName && 
      email && 
      validateEmail(email) && 
      password && 
      confirmPassword && 
      password === confirmPassword && 
      Object.values(passwordCriteria).every(Boolean) && 
      !firstNameError && 
      !lastNameError && 
      !emailError && 
      !passwordError && 
      !passwordCriteriaError
    );
  };

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Theme Toggle Button */}
      <div className="theme-toggle-button" onClick={toggleTheme}>
        <img
          className="toggle-icon"
          src={isDarkMode ? toggleLightIcon : toggleDarkIcon}
          alt={isDarkMode ? 'Light mode' : 'Dark mode'}
        />
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <h1 className="header">Register</h1>

        <div className="input-container">
          <input
            className="input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => setFirstNameError('')}
            onBlur={() => {
              if (!validateName(firstName)) {
                setFirstNameError('First name must start with a capital letter');
              }
            }}
          />
        </div>
        {firstNameError && <div className="error-message">{firstNameError}</div>}

        <div className="input-container">
          <input
            className="input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => setLastNameError('')}
            onBlur={() => {
              if (!validateName(lastName)) {
                setLastNameError('Last name must start with a capital letter');
              }
            }}
          />
        </div>
        {lastNameError && <div className="error-message">{lastNameError}</div>}

        <div className="input-container">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailError('')}
            onBlur={() => {
              if (!validateEmail(email)) {
                setEmailError('Incorrect e-mail address');
              }
            }}
          />
        </div>
        {emailError && <div className="error-message">{emailError}</div>}

        <div className="input-container">
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
          />
          <div
            className="toggle-password-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash style={{ color: 'black' }} />
            ) : (
              <FaEye style={{ color: 'black' }} />
            )}
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
        {passwordError && <div className="error-message">{passwordError}</div>}

        <div className="input-container">
          <input
            className="input"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className="toggle-password-button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FaEyeSlash style={{ color: 'black' }} />
            ) : (
              <FaEye style={{ color: 'black' }} />
            )}
          </div>
        </div>
        {passwordCriteriaError && <div className="error-message">{passwordCriteriaError}</div>}

        <button
          className="submit-button"
          type="submit"
          style={{
            backgroundColor: isDarkMode ? 'black' : 'white',
            color: isDarkMode ? 'white' : 'black',
            opacity: isFormValid() ? 1 : 0.6, // Disable if form is invalid
            cursor: isFormValid() ? 'pointer' : 'not-allowed',
          }}
          disabled={!isFormValid()} // Disable button when form is invalid
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Register;
