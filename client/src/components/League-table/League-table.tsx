import { FC, useEffect, useState } from 'react';
import styles from './League-table.module.css';
import { updateLeague, updatePrediction } from '../../Util/ApiService';

//TODO render calculated points on first load

const LeagueTable: FC<LeagueTableProps> = ({ league, userTeams, fixtures, predictions }) => {
  const { players } = league;
  const [loading, setLoading] = useState<boolean>(true);
  console.log(predictions)

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
                !prediction.updated
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
  
              const updatedPrediction = {
                points: points,
                goal: goals > 0,
                updated: true,
                ID: prediction._id,
              };
              await updatePrediction(prediction._id, updatedPrediction);
              await updateLeague({
                _id: league._id,
                players: [
                  {
                    user: player.user,
                    points: points,
                    goals: goals,
                    predictions: [prediction.match],
                  },
                ],
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error while calculating points:', error);
    }
  };

  useEffect(() => {
    updatePlayerData()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

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
      ) : (
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
      )}
    </div>
  );
};

export default LeagueTable;