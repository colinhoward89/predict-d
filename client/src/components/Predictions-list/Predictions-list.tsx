import React, { FC, useEffect, useState, useMemo } from 'react';
import styles from './Predictions-list.module.css';
import { getMyLeagues, getAllFixtures } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';

interface PredictionsListProps { }

const PredictionsList: FC<PredictionsListProps> = () => {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'past' | 'future'>('future');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const userId = currentUser?.id;
      console.log(userId)
      if (userId) {
        const leagues = await getMyLeagues(userId);
        console.log(leagues)
        const fixturesPromises = leagues.map(async (league: any) => {
          try {
            const response = await getAllFixtures(league.competition);
            console.log(response);
            return response;
          } catch (error) {
            console.error(`Failed to fetch fixtures for league ${league.id}`, error);
            return []; // Return an empty array if there is an error to avoid breaking Promise.all
          }
        });
        console.log(fixturesPromises);
        const fixturesArray = await Promise.all(fixturesPromises);
        console.log(fixturesArray)
        const allFixtures = fixturesArray.flat();

        setFixtures(allFixtures);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch fixtures', error);
    }
  };

  const handleFilterChange = (selectedFilter: 'past' | 'future') => {
    setFilter(selectedFilter);
  };

  const filteredFixtures = useMemo(() => {
    const currentDate = new Date().getTime();

    return fixtures.filter((fixture) => {
      const fixtureDate = new Date(fixture.date).getTime();
      if (filter === 'past') {
        return fixtureDate < currentDate;
      } else {
        return fixtureDate >= currentDate;
      }
    });
  }, [fixtures, filter]);

  return (
    <div className={styles.PredictionsList}>
      <div className={styles.ButtonsContainer}>
        <button
          className={filter === 'future' ? styles.ActiveButton : styles.Button}
          onClick={() => handleFilterChange('future')}
        >
          Future
        </button>
        <button
          className={filter === 'past' ? styles.ActiveButton : styles.Button}
          onClick={() => handleFilterChange('past')}
        >
          Past
        </button>
      </div>
      {loading ? (
        <p>Loading fixtures...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Home</th>
              <th>Away</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFixtures.map((fixture) => (
              <tr key={fixture.fixtureId}>
                <td>{fixture.date}</td>
                <td>{fixture.home.name}</td>
                <td>{fixture.away.name}</td>
                <td>{fixture.score.home} - {fixture.score.away}</td>
                <td>{fixture.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PredictionsList;
