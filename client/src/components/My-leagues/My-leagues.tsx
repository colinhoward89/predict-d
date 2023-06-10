import React, { FC, useEffect, useState } from 'react';
import styles from './My-leagues.module.css';
import { getMyLeagues } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';
import LeagueTable from '../League-table/League-table';

interface MyLeaguesProps {}

const MyLeagues: FC<MyLeaguesProps> = () => {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const [selectedLeague, setSelectedLeague] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      fetchMyLeagues();
    }
  }, [currentUser]);

  const fetchMyLeagues = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const response = await getMyLeagues(userId);
        setLeagues(response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch my leagues', error);
      setLoading(false);
    }
  };

  const handleLeagueClick = (league: any) => {
    setSelectedLeague(league);
  };

  const handleBackClick = () => {
    setSelectedLeague(null);
  };

  return (
    <div className={styles.MyLeagues}>
      {selectedLeague ? (
        <>
          <button onClick={handleBackClick}>Back</button>
          <LeagueTable league={selectedLeague} />
        </>
      ) : (
        <>
          <h2>My Leagues</h2>
          {loading ? (
            <p>Loading leagues...</p>
          ) : leagues.length > 0 ? (
            <ul>
              {leagues.map((league) => (
                <li key={league._id}>
                  <button onClick={() => handleLeagueClick(league)}>{league.name}</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No leagues found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MyLeagues;
