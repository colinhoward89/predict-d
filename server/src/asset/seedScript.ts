import User from "../models/user";
import League from "../models/league";
import Prediction from "../models/prediction";
import bcrypt from 'bcrypt';

//WARN:
// This function populates the Users, Leagues and Predictions collection in the database.
// It needs to be executed only once before starting to get a better feel of the app in action.

async function populateDatabase() {
  try {
    const hash = await bcrypt.hash('password', 10);
    const users = [
      {
        email: 'user@email.com',
        password: hash,
        team: 'Nostradamus FC'
      }, {
        email: 'user1@email.com',
        password: hash,
        team: 'Game of Throw-Ins'
      }, {
        email: 'user2@email.com',
        password: hash,
        team: 'Absolutely Fabregas'
      }, {
        email: 'user3@email.com',
        password: hash,
        team: `Murder on Zidane's Floor`
      }, {
        email: 'user4@email.com',
        password: hash,
        team: 'Expected Toulouse'
      }, {
        email: 'user5@email.com',
        password: hash,
        team: `It's Getting Messi`
      },
    ]
    const insertedUsers = await User.insertMany(users);
    const userObjectIDs = insertedUsers.map(user => user._id);
    const leagues = [{
      name: 'Cool Kids',
      competition: 131,
      admin: userObjectIDs[0],
      players: [
        { user: userObjectIDs[0] },
        { user: userObjectIDs[1] },
        { user: userObjectIDs[2] },
        { user: userObjectIDs[3] },
        { user: userObjectIDs[4] },
        { user: userObjectIDs[5] },]
    }]
    const insertedLeagues = await League.insertMany(leagues);
    const leagueObjectIDs = insertedLeagues.map(league => league._id);

    const predictions = [];

    const getRandomNumber = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    for (let i = 0; i < userObjectIDs.length; i++) {
      const user = userObjectIDs[i];
      for (let match = 986991; match <= 987010; match++) {
        const home = getRandomNumber(0, 4);
        const away = getRandomNumber(0, 4);
        predictions.push({ user, match, home, away });
      }
    }

    const insertedPredictions = await Prediction.insertMany(predictions);

    console.log('Database populated!')
  } catch (err) {
    console.log(err)
  }
}

export default populateDatabase;