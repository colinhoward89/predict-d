import { FC, useEffect, useState } from 'react';
import styles from './My-leagues.module.css';
import { getMyLeagues } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';
import CalculateTables from '../Calculate-tables/Calculate-tables';

const MyLeagues: FC<MyLeaguesProps> = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchMyLeagues();
    }
  }, [currentUser]);

  // Retrieve leagues that user is part of from the database
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

  const handleLeagueClick = (league: League) => {
    setSelectedLeague(league);
  };

  const handleBackClick = () => {
    setSelectedLeague(null);
  };

  return (
    <div className={styles.MyLeagues}>
      {selectedLeague ? (
        <>
          <button
            className={styles.ActiveButton}
            onClick={handleBackClick}
            aria-label="Go back"
            title="Go back"
          >
            Back
          </button>
          <CalculateTables league={selectedLeague} />
        </>
      ) : (
        <>
          {loading ? (
            <div
              className={styles.LoadingMessage}
              aria-busy="true"
              aria-describedby="loading-description"
              id="loading-description"
            >
              Loading leagues...
            </div>
          ) : leagues.length > 0 ? (
            <ul className={styles.LeagueList}>
              {leagues.map((league) => (
                <li key={league._id}>
                  <button
                    onClick={() => handleLeagueClick(league)}
                    aria-label={`Select ${league.name}`}
                  >
                    {league.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.WarningMessage} role="alert" aria-live="assertive">
              No leagues found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyLeagues;