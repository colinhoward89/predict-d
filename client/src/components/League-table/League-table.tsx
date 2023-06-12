import React, { FC, useState, useEffect } from 'react';
import styles from './League-table.module.css';
import { getAllUsers, getAllFixtures, getAllPredictions, updateLeague, updatePrediction } from '../../Util/ApiService';

const LeagueTable: FC<LeagueTableProps> = ({ league }) => {
  const { players } = league;
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserTeamsAndFixtures = async () => {
      try {
        const users = await getAllUsers();
        const userTeamsData = users.map((user: any) => ({
          id: user._id,
          team: user.team,
        }));
        setUserTeams(userTeamsData);
        console.log(userTeamsData)
        // Get all fixtures
        const fixturesResponse = await getAllFixtures(league.competition);
        const fixtures = fixturesResponse.filter((fixture: Fixture) => fixture.status === 'FT');
        setFixtures(fixtures);
        // Get all predictions
        const predictionsResponse = await getAllPredictions();
        const predictions = predictionsResponse.filter((prediction: any) => !prediction.updated);
        console.log(league)
        console.log(fixtures)
        console.log(predictions)
        console.log(players)
        console.log(userTeams)

        const updatePlayerData = async () => {
          for (const player of players) {
            const userTeam = userTeams.find((user: any) => user.id === player.user);
            console.log(userTeam)
            if (userTeam) {
              for (const fixture of fixtures) {
                const prediction = predictions.find(
                  (prediction: any) => prediction.user === userTeam.id && prediction.match === fixture.fixtureId
                );

                if (prediction) {
                  const homeScore = fixture.score.home;
                  const awayScore = fixture.score.away;
                  const homePrediction = prediction.home;
                  const awayPrediction = prediction.away;

                  let points = 0;
                  let goals = 0;

                  if (homePrediction === homeScore && awayPrediction === awayScore && homeScore + awayScore >= 5) {
                    points = 8;
                    goals = 1;
                  } else if (
                    (homePrediction > awayPrediction && homeScore > awayScore) ||
                    (homePrediction === awayPrediction && homeScore === awayScore) ||
                    (homePrediction < awayPrediction && homeScore < awayScore)
                  ) {
                    points = 3;

                    if (
                      homePrediction === homeScore ||
                      awayPrediction === awayScore ||
                      Math.abs(homePrediction - awayPrediction) === Math.abs(homeScore - awayScore)
                    ) {
                      points += 1;
                    }

                    goals = 0;
                  }
                  console.log(league)
                  // Update player's points, goals, and predictions
                  const playerIndex = league.players.findIndex((p: any) => p.user.toString() === player.user.toString());
                  if (playerIndex !== -1) {
                    league.players[playerIndex].points += points;
                    league.players[playerIndex].goals += goals;
                    league.players[playerIndex].predictions.push(prediction.match);
                    await updateLeague(league);
                  }

                  // Update the prediction
                  const updatedPrediction = {
                    points: points,
                    goal: goals > 0,
                    updated: true,
                    ID: prediction._id,
                  };
                  console.log(prediction)
                  console.log(updatedPrediction)
                  await updatePrediction(prediction._id, updatedPrediction);
                }
              }
            }
          }
        };
        await updatePlayerData();
      } catch (error) {
        console.error('Failed to fetch fixtures and predictions:', error);
      }
    };
    fetchUserTeamsAndFixtures()
    setLoading(false);

  }, []);

  const sortedPlayers = players.sort((a: any, b: any) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else {
      return b.goals - a.goals;
    }
  });

  return (
    loading ? (
      <p>Loading tables...</p>
    ) : (
      <div className={styles.Container}>
        <div className={styles.LeagueTable}>
          <h2>{league.name} Table</h2>
          <table className={styles.Table}>
            <caption>League Table</caption>
            <thead>
              <tr>
                <th scope="col">Position</th>
                <th scope="col">Team</th>
                <th scope="col">Points</th>
                <th scope="col">Goals</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player: any, index: number) => {
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
          <p>
          Goals are awarded for correct scores
          </p><p>
            Correct score with 5+ match goals = 8 points
          </p><p>
            Correct score with 4 match goals or less = 5 points
          </p><p>
            If you didn't get the score correct, you receive:
          </p><p>
            Correct result = 3 points
          </p><p>
            Correct home or away goals = 1 point
          </p><p>
            Correct goal differential and within 2 goals (i.e. predict 3-1 and result is 1-0) = 1 point
          </p>
        </div>
      </div>
    )
  );
};

export default LeagueTable;