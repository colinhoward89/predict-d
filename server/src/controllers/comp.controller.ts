import { Request, Response } from 'express';
import axios from 'axios';

const getAllComps = async (req: Request, res: Response) => {
  try {
    const url = 'https://api-football-v1.p.rapidapi.com/v3/leagues';
    const response = await axios({
      method: 'GET',
      url: url,
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_KEY,
        'X-RapidAPI-Host': process.env.RAPID_HOST
      }
    });
    const competitions = response.data.response;
    // Filter the competitions based on the criteria
    const filteredCompetitions = competitions.filter((league: any) => {
      // Only retrieve competitions that are currently running
      return league.seasons.some((season: any) => {
        return season.year >= 2023 && season.coverage.fixtures.events === true;
      });
    });

    // Only extract information needed
    const extractedCompetitions = filteredCompetitions.map((league: any) => {
      return {
        id: league.league.id,
        name: league.league.name,
        type: league.league.type,
        logo: league.league.logo,
        countryName: league.country.name,
      };
    });

    // Send the extracted competitions as the response
    res.json(extractedCompetitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export { getAllComps };
