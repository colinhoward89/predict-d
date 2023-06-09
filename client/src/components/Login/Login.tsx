import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Util/ApiService';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    return !email || !password;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      if (response.ok) {
        navigate('/home');
      } else {
        console.error('Login failed response not ok');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="name@mail.com" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="******" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" disabled={validateForm()}>Login</button>
      </form>
    </div>
  );
};

export default Login;