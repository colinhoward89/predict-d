import React, { FC } from 'react';
import styles from './League-table.module.css';

interface LeagueTableProps {
  league: any;
}

const LeagueTable: FC<LeagueTableProps> = ({ league }) => {
  const { players } = league;

  // Sort the players based on points and goals
  const sortedPlayers = players.sort((a: any, b: any) => {
    if (a.points !== b.points) {
      return b.points - a.points; // Sort by points (descending order)
    } else {
      return b.goals - a.goals; // Sort by goals (descending order) if points are equal
    }
  });

  return (
    <div className={styles.LeagueTable}>
      <h2>{league.name} Table</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>User</th>
            <th>Points</th>
            <th>Goals</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player: any, index: number) => (
            <tr key={player.user}>
              <td>{index + 1}</td>
              <td>{player.user}</td>
              <td>{player.points}</td>
              <td>{player.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
