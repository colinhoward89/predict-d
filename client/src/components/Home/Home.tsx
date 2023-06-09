import React, { FC, useState } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';

const Home: FC = () => {
  const [currentTab, setCurrentTab] = useState('login');
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleAuthentication = () => {
    navigate('/leagues');
  };

  return (
    <div className={styles.Home}>
      {currentTab === 'login' ? (
        <Login />
      ) : (
        <Register />
      )}
      <div className={styles.TabContainer}>
        <button
          type="button"
          className={currentTab === 'login' ? styles.ActiveTab : ''}
          onClick={() => handleTabChange('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={currentTab === 'register' ? styles.ActiveTab : ''}
          onClick={() => handleTabChange('register')}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
