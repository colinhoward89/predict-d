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

const getPredictions = async (req: Request, res: Response) => {
  try {
    const { userId, fixtureId } = req.query;
    const predictions = await Prediction.find({
      user: userId,
      match: fixtureId,
    });
    res.json(predictions);
  } catch (error) {
    console.error('Failed to fetch predictions', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

const editPredict = async (req: Request, res: Response) => {
  try {
    const { userID, match } = req.params;
    const { home, away } = req.body;

    const prediction = await Prediction.findOneAndUpdate(
      { user: userID, match: parseInt(match) },
      { home, away },
      { new: true }
    );

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.status(200).json(prediction);
  } catch (error) {
    console.error('Failed to edit prediction', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export { predictOne, getPredictions, editPredict }