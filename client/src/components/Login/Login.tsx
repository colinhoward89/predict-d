import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { handleGetUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    return !email || !password;
  };

  /* if username or password is wrong it alerts user otherwise sets user as
  authorised and navigates to Leagues page */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.error) {
        console.error('Login failed response not ok');
        setLoginError(true);
      } else {
        handleGetUser(email);
        navigate('/leagues');
      }
    } catch (error) {
      console.error('Login failed', error);
      setLoginError(true);
    }
  };

  return (
    <div className={styles.Login}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className={styles.HiddenLabel}>Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleEmailChange}
            required
            aria-label="Email"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.HiddenLabel}>Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
            required
            aria-label="Password"
          />
        </div>
        <button type="submit" disabled={validateForm()} aria-label="Login Button" className={styles.LoginButton}>
          Login
        </button>
        {loginError && (
          <div className={styles.WarningMessage} role="alert" aria-live="assertive">
            Login failed
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;