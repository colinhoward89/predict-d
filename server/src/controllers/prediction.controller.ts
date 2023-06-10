import { Request, Response } from 'express';
import Prediction from '../models/prediction';

const predictOne = async (req: Request, res: Response) => {
  try {
    const { userID, match, home, away } = req.body;

    const newPrediction = new Prediction({
      user: userID,
      match,
      home,
      away
    });

    const savedPrediction = await newPrediction.save();

    res.status(201).json(newPrediction);
  } catch (error) {
    console.error('Failed to create league', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export { predictOne }