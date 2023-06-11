import { FC, useState } from 'react';
import styles from './Home.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';

const Home: FC = () => {
  const [currentTab, setCurrentTab] = useState('login');

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <main className={styles.Home}>
      <nav className={styles.TabContainer}>
        <button
          type="button"
          className={currentTab === 'login' ? styles.ActiveTab : ''}
          onClick={() => handleTabChange('login')}
          aria-label="Login"
          aria-selected={currentTab === 'login'}
          role="tab"
        >
          Login
        </button>
        <button
          type="button"
          className={currentTab === 'register' ? styles.ActiveTab : ''}
          onClick={() => handleTabChange('register')}
          aria-label="Register"
          aria-selected={currentTab === 'register'}
          role="tab"
        >
          Register
        </button>
      </nav>
      <section className={styles.ContentContainer}>
        {currentTab === 'login' && <Login />}
        {currentTab === 'register' && <Register />}
      </section>
    </main>
  );
};

export default Home;