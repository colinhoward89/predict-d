import React, { FC, useEffect, useState } from 'react';
import styles from './Join-league.module.css';
import { getLeaguesToJoin, joinLeague } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';

interface JoinLeagueProps {}

const JoinLeague: FC<JoinLeagueProps> = () => {
  const [leagues, setLeagues] = useState<League[]>([]); 
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLeaguesToJoin();
  }, []);

  const fetchLeaguesToJoin = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const response = await getLeaguesToJoin(userId);
        setLeagues(response.map((league: any) => ({ id: league._id, name: league.name })));
      }
    } catch (error) {
      console.error('Failed to fetch leagues to join', error);
    }
  };

  const handleJoinLeague = async (leagueId: string | undefined) => {
    try {
      const userId = currentUser?.id;
      if (userId && leagueId) {
        const response = await joinLeague(leagueId, userId);
        if (response.success) {
          console.log(`Successfully joined the league with ID: ${leagueId}`);
        } else {
          console.error(`Failed to join the league with ID: ${leagueId}`);
        }
      }
    } catch (error) {
      console.error(`Failed to join the league with ID: ${leagueId}`, error);
    }
  };

  return (
    <div className={styles.JoinLeague}>
      <h2>Join Leagues</h2>
      {leagues.length > 0 ? (
        <ul>
          {leagues.map((league) => (
            <li key={league.id}>
              {league.name}
              <button onClick={() => handleJoinLeague(league.id)}>Join League</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No leagues available to join.</p>
      )}
    </div>
  );  
};

export default JoinLeague;
