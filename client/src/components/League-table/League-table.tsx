import { FC } from 'react';
import styles from './League-table.module.css';

const LeagueTable: FC<LeagueTableProps> = ({ league, userTeams }) => {
  const { players } = league;

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
      return players; // Return the original players array in case of an error
    }
  };

  return (
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
  );
};

export default LeagueTable;