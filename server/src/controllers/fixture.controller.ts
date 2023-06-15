import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from 'express';
import axios from 'axios';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getAIPredictions = async (req: Request, res: Response) => {
  const fixtureData = req.body.teamForms.map((fixture: any) => {
    const fixtureID = fixture.fixtureId;
    const homeID = fixture.homeId;
    const awayID = fixture.awayId;
    
    return `FixtureID: ${fixtureID} ${homeID} are at home to ${awayID}`;
  });
  
  const homeTeamForm = req.body.teamForms.map((fixture:any) => {
    const homeID = fixture.homeId;
    const homeTeamForm = fixture.homeTeamForm.map((item: any) => `${item.team}-${item.opposition}`).join('\n');
    
    return `${homeID}:\n${homeTeamForm}`;
  });
  
  const awayTeamForm = req.body.teamForms.map((fixture:any ) => {
    const awayID = fixture.awayId;
    const awayTeamForm = fixture.awayTeamForm.map((item:any) => `${item.team}-${item.opposition}`).join('\n');
    
    return `${awayID}:\n${awayTeamForm}`;
  });
  
  const resultPrediction = 'Provide a result prediction for each fixture once. Return them in an array with an object like this [{FixtureID: ID number, Score: { Home: number of goals, Away: number of goals }}]';

  const prompt = `${fixtureData.join('\n')}\n\nLast 5 games, ordered by most recent with selected team’s goals first:\n\n${homeTeamForm.join('\n\n')}\n\n${awayTeamForm.join('\n\n')}\n\n${resultPrediction}`;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const aiResponse = response.data.choices[0].text;
    console.log("AI Response", aiResponse);
    res.json({ aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getAllFixtures = async (req: Request, res: Response) => {
  try {
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

const getTeamForm = async (req: Request, res: Response) => {
  try {
    const teamID = req.params.teamID;
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures`;
    const response = await axios({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {
        team: teamID,
        last: '5'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_KEY,
        'X-RapidAPI-Host': process.env.RAPID_HOST
      }
    });
    const fixtures = response.data.response;
    const extractedData = fixtures.map((fixture: any) => {
      if (fixture.teams.home.id == teamID) {
        return {
          team: fixture.score.fulltime.home,
          opposition: fixture.score.fulltime.away
        };
      } else {
        return {
          team: fixture.score.fulltime.away,
          opposition: fixture.score.fulltime.home
        };
      }
    });
    res.json(extractedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export { getAllFixtures, getTeamForm, getAIPredictions };