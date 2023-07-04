import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
const SECRET = process.env.SECRET || 'this is not very secure';
import router from './router';
import dotenv from 'dotenv';
dotenv.config();
import { dbConnection } from './models/index';
import User from './models/user';
import populateDatabase from './asset/seedScript';

const app: Express = express();
const PORT: Number = Number(process.env.PORT) || 4000;

app.get('/', (req, res) => {
res.send('Hello!')
});

(async () => {
  try {
    await dbConnection;

    console.log('Connected to DB');

    const user = await User.find();
    if (user.length === 0) populateDatabase()


    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();

app
  .use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  }))
  .use(express.json())
  .use(router)
  .use(session({
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1hr
      sameSite: true,
      httpOnly: false,
      secure: false,
    },
  })
);

export default app;