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
  const [renderTable, setRenderTable] = useState<boolean>(false);

//TODO fix loading screen

  useEffect(() => {
    fetchUsers()
    fetchFixtures();
    fetchPredictions();
    filterPredictions();
  }, [])

  const fetchUsers = async () => {
    try {
      const users = await getAllUsers()
      setUserTeams(users);
    } catch (error) {
      console.log("Error fetching users", error)
    }
  };

  const fetchFixtures = async () => {
    try {
      const fixturesResponse = await getAllFixturesFiltered(league.competition);
      setFixtures(fixturesResponse);
    } catch (error) {
      console.error('Error while fetching data:', error);
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      const predictionsResponse = await getAllPredictions();
      setPredictions(predictionsResponse);
    } catch (error) {
      console.error('Error while fetching prediction data:', error);
    }
  }

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
        setRenderTable(true);
      }, 3000);

    setLoading(false);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {loading ? (
        <p className={styles.p}>Loading...</p>
      ) : renderTable ? (
        <LeagueTable league={league} userTeams={userTeams} fixtures={fixtures} predictions={predictions} />
      ) : null}
    </div>
  );
};

export default CalculateTables;