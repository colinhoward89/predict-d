import React, { FC } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => (
  <div className={styles.Navbar}>
    Profile, Leagues, Predictions, Logout
  </div>
);

export default Navbar;
