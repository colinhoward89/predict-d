import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../AuthContext';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.Navbar}>
      <button onClick={() => handleNavigation('/')}>Profile</button>
      <button onClick={() => handleNavigation('/leagues')}>Leagues</button>
      <button onClick={() => handleNavigation('/predictions')}>Predictions</button>
      <button onClick={() => handleNavigation('/logout')}>Logout</button>
    </div>
  );
};

export default Navbar;
