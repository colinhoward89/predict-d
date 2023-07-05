import mongoose from 'mongoose';

import * as dotenv from 'dotenv'
dotenv.config()

const dbName = process.env.DB_TEST || 'predictd';
const dbURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

const dbConnection = mongoose.connect(`${dbURL}/${dbName}`, {});

export {mongoose, dbConnection};