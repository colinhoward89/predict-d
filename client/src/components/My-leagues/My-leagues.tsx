import React, { FC } from 'react';
import styles from './My-leagues.module.css';

interface MyLeaguesProps {}

const MyLeagues: FC<MyLeaguesProps> = () => (
  <div className={styles.MyLeagues}>
    MyLeagues Component
  </div>
);

export default MyLeagues;
