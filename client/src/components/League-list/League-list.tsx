import React, { FC, useContext, useEffect } from 'react';
import styles from './League-list.module.css';
import { AuthContext } from './../../AuthContext';

interface LeagueListProps {}

const LeagueList: FC<LeagueListProps> = () => {
  const { currentUser, isAuthenticated, handleGetUser } = useContext(AuthContext);

  return (
    <div className={styles.LeagueList}>
      LeagueList Component
    </div>
  );
};

export default LeagueList;
