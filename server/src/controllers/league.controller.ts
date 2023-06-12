import { Request, Response } from 'express';
import League from '../models/league';

const createLeague = async (req: Request, res: Response) => {
  try {
    const { name, competition, admin } = req.body;

    const newLeague = new League({
      name,
      competition,
      admin,
      players: [
        {
          user: admin,
          predictions: [],
          points: 0,
          goals: 0,
        },
      ],
    });

    const savedLeague = await newLeague.save();

    res.status(201).json(savedLeague);
  } catch (error) {
    console.error('Failed to create league', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getMyLeagues = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const leagues = await League.find({ 'players.user': userId });
    res.status(200).json(leagues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getLeaguesToJoin = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const leagues = await League.find({ 'players.user': { $ne: userId } });
    res.status(200).json(leagues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const joinLeague = async (req: Request, res: Response) => {
  try {
    const { leagueId, userID } = req.body;
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    // Check if the user is already a player in the league
    const existingPlayer = league.players.find((player) => player.user.toString() === userID);
    if (existingPlayer) {
      return res.status(400).json({ error: 'User already joined the league' });
    }

    // Add the user as a player in the league
    league.players.push({ user: userID, predictions: [], points: 0, goals: 0 });
    await league.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to join the league', err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const updateLeague = async (req: Request, res: Response) => {
  try {
    const { _id, players } = req.body;

    const league = await League.findById(_id);
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    for (const { user, points, goals } of players) {
      const playerIndex = league.players.findIndex((player) => player.user.toString() === user);
      if (playerIndex === -1) {
        return res.status(404).json({ error: 'Player not found in the league' });
      }

      league.players[playerIndex].points += points;
      league.players[playerIndex].goals += goals;
    }

    await league.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to update league', err);
    res.status(500).json({ error: 'An error occurred' });
  }
};


export { createLeague, getMyLeagues, getLeaguesToJoin, joinLeague, updateLeague };