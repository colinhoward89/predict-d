import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { handleGetUser } = useAuth();

  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleTeamChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeam(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    return (
      !email ||
      !team ||
      !password
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createUser(email, team, password);
      if (response.error) {
        console.error('Registration failed');
      } else {
        handleGetUser(email);
        navigate('/leagues');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="name@mail.com" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label>Team:</label>
          <input type="text" placeholder="Nostradamus" value={team} onChange={handleTeamChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="******" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" disabled={validateForm()}>Register</button>
      </form>
    </div>
  );
};

export default Register;

