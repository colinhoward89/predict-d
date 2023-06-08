import express, { Express, Request, Response } from 'express';
import session from 'express-session';
const SECRET = process.env.SECRET || 'this is not very secure';
import router from './router';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const PORT: Number = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app
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