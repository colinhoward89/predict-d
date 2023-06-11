import { FC, useEffect, useState } from 'react';
import styles from './Join-league.module.css';
import { getLeaguesToJoin, joinLeague } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';

const JoinLeague: FC<JoinLeagueProps> = ({ onJoinLeague }) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLeaguesToJoin();
  }, []);

  // Retrieves leagues from the database that the user is not a member of
  const fetchLeaguesToJoin = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const response = await getLeaguesToJoin(userId);
        setLeagues(response.map((league: League) => ({ _id: league._id, name: league.name })));
      }
    } catch (error) {
      console.error('Failed to fetch leagues to join', error);
    }
  };

  // Adds user to the joined league and navigates to My Leagues page
  const handleJoinLeague = async (leagueId: string | undefined) => {
    try {
      const userId = currentUser?.id;
      if (userId && leagueId) {
        const response = await joinLeague(leagueId, userId);
        if (response.success) {
          onJoinLeague();
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
      {leagues.length > 0 ? (
        <ul className={styles.JoinLeagueList}>
          {leagues.map((league) => (
            <li key={league._id} className={styles.JoinLeagueItem}>
              <div className={styles.JoinLeagueContainer}>
                <button
                  className={styles.JoinButton}
                  onClick={() => handleJoinLeague(league._id)}
                  aria-label={`Join ${league.name}`}
                >
                  <span className={styles.JoinLeagueName}>{league.name}</span>
                  Join
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : leagues.length === 0 ? (
        <div className={styles.WarningMessage} role="alert" aria-live="assertive" aria-atomic="true">
          No leagues found
        </div>
      ) : (
        <div>Loading leagues...</div>
      )}
    </div>
  );
};

export default JoinLeague;