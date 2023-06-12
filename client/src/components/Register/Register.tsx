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
  const [errorMessage, setErrorMessage] = useState('');

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
    return !email || !team || !password;
  };

  /* If user or team name exists it alerts user otherwise sets user as
  authorised and navigates to Leagues page */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createUser(email, team, password);
      if (response.error) {
        setErrorMessage(response.message || 'Registration failed');
      } else {
        handleGetUser(email);
        navigate('/leagues');
      }
    } catch (error) {
      console.error('Registration failed', error);
      setErrorMessage('Could not create user');
    }
  };

  return (
    <div className={styles.Register}>
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
          />
        </div>
        <div>
          <label htmlFor="team name" className={styles.HiddenLabel}>Team</label>
          <input
            type="text"
            id="team"
            placeholder="Enter Team Name"
            value={team}
            onChange={handleTeamChange}
            required
            aria-label="Team"
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
        <button
          type="submit"
          disabled={validateForm()}
          aria-label="Register Button"
          className={styles.RegisterButton}
        >
          Register
        </button>
        {errorMessage && (
          <p className={styles.ErrorMessage} role="alert" aria-live="assertive">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;