import React, { FC, useEffect, useState } from 'react';
import styles from './My-leagues.module.css';
import { getMyLeagues } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';

interface MyLeaguesProps {}

const MyLeagues: FC<MyLeaguesProps> = () => {
  const [leagues, setLeagues] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchMyLeagues();
  }, []);

  const fetchMyLeagues = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const response = await getMyLeagues(userId);
        setLeagues(response.map((league: any) => league.name));
      }
    } catch (error) {
      console.error('Failed to fetch my leagues', error);
    }
  };

  return (
    <div className={styles.MyLeagues}>
      <h2>My Leagues</h2>
      {leagues.length > 0 ? (
        <ul>
          {leagues.map((league) => (
            <li key={league}>{league}</li>
          ))}
        </ul>
      ) : (
        <p>No leagues found.</p>
      )}
    </div>
  );
};

export default MyLeagues;