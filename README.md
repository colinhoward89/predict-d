# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary

This app is for predicting football results against your family and friends. Create (or join) a league and select a competition to start predicting results.

* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up

In the `/server` folder, create a file called .env:

```bash
touch .env
```

In this file, you will need to store your API-FOOTBALL details from [Rapid API](https://rapidapi.com/api-sports/api/api-football/)

```bash
RAPID_KEY="xxx"
RAPID_HOST="xxx"
```

Run `npm i` in order to install all server dependencies and then run `npx nodemon` to start the server.

Open another terminal and `cd` into the `/client` folder. If you are still in the server folder, `cd ..` into the root folder first, before moving into the client.

Once in the client folder, install all dependencies using `npm i`. Then, run `npm start` to run the scripts and connect the front end. Once all of the above steps are taken, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

* Configuration
* Dependencies
* Database configuration

This app runs on MongoDB, there is a seed script to populate this when the server is started. I recommend logging in as user@email.com and password as this user is already subscribed to a league and has some past predictions populated.

* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact