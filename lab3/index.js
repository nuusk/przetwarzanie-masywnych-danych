// import Sequelize from 'sequelize';
const pg = require('pg');

const DB_PASSWORD = 'NIEpodam123';
const DB_USER = 'poe';
const DB_NAME = 'million-song';

const Database = require('./services/Database');
const db = new Database();

db.constructor.initializeConnection();
db.initializeTables();

// const sequelize = new Sequelize(process.env.TEST_DB || DB_NAME, DB_USER, DB_PASSWORD, {
//   dialect: 'postgres',
//   operatorsAliases: Sequelize.Op,
//   host: process.env.DB_HOST || 'localhost',
//   define: {
//     underscored: true,
//   }
// });

// const client = new pg.Client('postgres://localhost:5432/poe');
// client.connect();

// client.query(
//   'create table if not exists tracks (trackID VARCHAR(32), performanceID VARCHAR(32), artistName VARCHAR(32), trackName VARCHAR(32))'
// );

// client.query(
//   'create table if not exists listenActivities (trackID VARCHAR(32),userID VARCHAR(32),activi DATE)'
// );

// query.on('end', () => {
//   client.end();
// });




// const express = require('express');

// require('dotenv').config();

// const app = express();
// const PORT = 5000;

// require('./routes/apiRoutes')(app);

// app.listen(PORT);
// console.log(`Server started running on port ${PORT}...`); 
