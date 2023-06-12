import { FC, useEffect, useState } from 'react';
import styles from './Calculate-tables.module.css';
import { getAllUsers, getAllFixturesFiltered, getAllPredictions, updateLeague, updatePrediction } from '../../Util/ApiService';
import LeagueTable from '../League-table/League-table';

const CalculateTables: FC<CalculateTablesProps> = ({ league }) => {
  const { players } = league;
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

//TODO fix loading screen and remove anys

  useEffect(() => {
    fetchUsers()
    fetchFixtures();
    fetchPredictions();
    filterPredictions();
  }, [])

  // Get users from databse
  const fetchUsers = async () => {
    try {
      const users = await getAllUsers()
      setUserTeams(users);
    } catch (error) {
      console.log("Error fetching users", error)
    }
  };

  // Get fixtures from database
  const fetchFixtures = async () => {
    try {
      const fixturesResponse = await getAllFixturesFiltered(league.competition);
      setFixtures(fixturesResponse);
    } catch (error) {
      console.error('Error while fetching data:', error);
    }
  };

  // Get predictions from database
  const fetchPredictions = async () => {
    try {
      const predictionsResponse = await getAllPredictions();
      setPredictions(predictionsResponse);
    } catch (error) {
      console.error('Error while fetching prediction data:', error);
    }
  }

  /* Filter predictions so that only those that match fixtures in this competition
  that haven't been previously are kept for points calculation */
  const filterPredictions = async () => {
    try {
      const predictionsFiltered = predictions.filter((prediction: any) => {
        const fixture = fixtures.find((fixture: Fixture) => fixture.fixtureId === prediction.match);
        return !prediction.updated && fixture;
      });
      setPredictions(predictionsFiltered);
    } catch (error) {
      console.error('Error filtering predictions:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      }, 1000);


    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {loading ? (
        <p className={styles.p}>Loading...</p>
      ) : (
        <LeagueTable league={league} userTeams={userTeams} fixtures={fixtures} predictions={predictions} />
      )}
    </div>
  );
};

export default CalculateTables;