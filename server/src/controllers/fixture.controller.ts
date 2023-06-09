import { Request, Response } from 'express';
import axios from 'axios';

const getAllFixtures = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    const compID = req.params.compid;
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures`;
    const response = await axios({
      method: 'GET',
      url: url,
      params: {
        league: compID,
        season: '2023'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_KEY,
        'X-RapidAPI-Host': process.env.RAPID_HOST
      }
    });
    const fixtures = response.data.response;
    const formattedFixtures = fixtures.map((fixture: any) => {
      const {
        fixture: { id: fixtureId, timezone, timestamp, date, status },
        teams: {
          home: { id: homeId, name: homeName, logo: homeLogo },
          away: { id: awayId, name: awayName, logo: awayLogo }
        },
        score: { fulltime: { home: homeGoals, away: awayGoals } }
      } = fixture;

      return {
        fixtureId,
        timezone,
        timestamp,
        date,
        status: status.short,
        home: {
          id: homeId,
          name: homeName,
          logo: homeLogo
        },
        away: {
          id: awayId,
          name: awayName,
          logo: awayLogo
        },
        score: {
          home: homeGoals,
          away: awayGoals
        }
      };
    });

    res.json(formattedFixtures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export { getAllFixtures };