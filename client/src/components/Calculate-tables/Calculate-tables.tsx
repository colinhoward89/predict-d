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

//TODO fix logic so it calculates table before rendering
//TODO fix logic so it doesn't give loads of points to one player
//TODO fix loading screen

  useEffect(() => {
    fetchUsers()
    fetchFixtures();
    fetchPredictions();
    filterPredictions();
    updatePlayerData();
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

  const updatePlayerData = async () => {
    try {
      console.log("userTeams", userTeams)
      console.log("Fixtures", fixtures)
      console.log("Predictions", predictions)
      for (const player of players) {
        const userTeam = userTeams.find((user: any) => user.id === player.user);
        if (userTeam) {
          for (const fixture of fixtures) {
            const prediction = predictions.find(
              (prediction: any) => prediction.user === userTeam.id && prediction.match === fixture.fixtureId && !prediction.updated
            );

            if (prediction) {
              prediction.updated = true;
              let points = 0;
              let goals = 0;

              if (
                prediction.home === fixture.score.home &&
                prediction.away === fixture.score.away &&
                fixture.score.home + fixture.score.away >= 5
              ) {
                points = 8;
                goals = 1;
              } else if (
                (prediction.home > prediction.away && fixture.score.home > fixture.score.away) ||
                (prediction.home === prediction.away && fixture.score.home === fixture.score.away) ||
                (prediction.home < prediction.away && fixture.score.home < fixture.score.away)
              ) {
                points = 3;

                if (
                  prediction.home === fixture.score.home ||
                  prediction.away === fixture.score.away ||
                  Math.abs(prediction.home - prediction.away) === Math.abs(fixture.score.home - fixture.score.away)
                ) {
                  points += 1;
                }
              }

              const playerIndex = league.players.findIndex((p: any) => p.user.toString() === player.user.toString());
              if (playerIndex !== -1) {
                league.players[playerIndex].points += points;
                league.players[playerIndex].goals += goals;
                league.players[playerIndex].predictions.push(prediction.match);
                await updateLeague(league);

              }
              const updatedPrediction = {
                points: points,
                goal: goals > 0,
                updated: true,
                ID: prediction._id,
              };
              await updatePrediction(prediction._id, updatedPrediction);
              fetchPredictions()
            }
          }
        }
      }
    }
    catch (error) {
      console.error('Error while calculating points:', error);
    }
  }

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      updatePlayerData();
      const timeout2 = setTimeout(() => {
        setRenderTable(true);
      }, 2000);

      return () => clearTimeout(timeout2);
    }, 2000);

    setLoading(false);
    return () => clearTimeout(timeout1);
  }, []);

  return (
    <div>
      {loading ? (
        <p className={styles.p}>Loading...</p>
      ) : renderTable ? (
        <LeagueTable league={league} userTeams={userTeams} />
      ) : null}
    </div>
  );
};

export default CalculateTables;