import { FC, useEffect, useState, useContext } from 'react';
import styles from './League-table.module.css';
import { updateLeague, updatePrediction, getAllPredictions } from '../../Util/ApiService';
import PredictionContext from '../../PredictionContext';

//TODO fix logic so it doesn't duplicate points and goals in DB

const LeagueTable: FC<LeagueTableProps> = ({ league, userTeams, fixtures, predictions }) => {
  const { players } = league;
  const [loading, setLoading] = useState<boolean>(true);
  const [renderTable, setRenderTable] = useState<boolean>(false);
  const [statePredictions, setPredictions] = useState<any[]>(predictions);
  const { updatedPredictions, setUpdatedPredictions } = useContext(PredictionContext);
  const [updatesPerformed, setUpdatesPerformed] = useState<boolean>(false);

  const updatePlayerData = async () => {
    try {
      for (const player of players) {
        const userTeam = userTeams.find((user: any) => user.id === player.user);
        if (userTeam) {
          for (const fixture of fixtures) {
            const prediction = predictions.find(
              (prediction: any) =>
                prediction.user === userTeam.id &&
                prediction.match === fixture.fixtureId &&
                !prediction.updated &&
                !updatedPredictions.includes(prediction._id)
            );

            if (prediction) {
              setUpdatedPredictions([...updatedPredictions, prediction._id])
              console.log(updatedPredictions)
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

              const updatedPrediction = {
                points: points,
                goal: goals > 0,
                updated: true,
                ID: prediction._id,
              };
              await updatePrediction(prediction._id, updatedPrediction);

              const playerIndex = players.findIndex((p: any) => p.user.toString() === player.user.toString());
              if (playerIndex !== -1) {
                players[playerIndex] = {
                  ...players[playerIndex],
                  points: players[playerIndex].points + points,
                  goals: players[playerIndex].goals + goals,
                  predictions: [...players[playerIndex].predictions, prediction.match],
                };
              }
            }
          }
        }
      }
      if (!updatesPerformed) {
        await updateLeague({
          ...league,
          players: players,
        });
        setUpdatesPerformed(true);
        console.log("League updated successfully");
      }
    } catch (error) {
      console.error('Error while calculating points:', error);
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

  useEffect(() => {
    updatePlayerData()
    fetchPredictions()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderTable(true);
    }, 3000);

    setLoading(false);
    return () => clearTimeout(timeout);
  }, []);

  const sortedPlayers = () => {
    try {
      return players.sort((a: any, b: any) => {
        if (a.points !== b.points) {
          return b.points - a.points;
        } else {
          return b.goals - a.goals;
        }
      });
    } catch (error) {
      console.error('Failed to sort players', error);
      return players;
    }
  };

  return (
    <div>
      {loading ? (
        <p className={styles.p}>Loading...</p>
      ) : renderTable ? (
        <div className={styles.Container}>
          <div className={styles.LeagueTable}>
            <h2>{league.name} Table</h2>
            <table className={styles.Table}>
              <thead>
                <tr>
                  <th scope="col">Position</th>
                  <th scope="col">Team</th>
                  <th scope="col">Points</th>
                  <th scope="col">Goals</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers().map((player: any, index: number) => {
                  const userTeam = userTeams.find((user: any) => user.id === player.user);
                  const teamName = userTeam ? userTeam.team : '';
                  return (
                    <tr key={player.user}>
                      <th scope="row">{index + 1}</th>
                      <td>{teamName}</td>
                      <td>{player.points}</td>
                      <td>{player.goals}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className={styles.Scoring}>
            <p>Goals are awarded for correct scores</p>
            <p>Correct score with 5+ match goals = 8 points</p>
            <p>Correct score with 4 match goals or less = 5 points</p>
            <p>If you didn't get the score correct, you receive:</p>
            <p>Correct result = 3 points</p>
            <p>Correct home or away goals = 1 point</p>
            <p>Correct goal differential and within 2 goals (i.e., predict 3-1 and result is 1-0) = 1 point</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LeagueTable;