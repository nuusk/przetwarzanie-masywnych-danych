const fs = require('fs');
const db = require('../services/Database');
const mongoose = require('mongoose');

require('dotenv').config();

const mongoURI = `mongodb://${process.env.DB_USER}
                  :${process.env.DB_PASS}
                  @${process.env.DB_HOST}`;

// const tracks = fs.readFileSync(`${__dirname}/../data/tracks.txt`, 'utf-8').split('\n');
// const listenActivities = fs.readFileSync(`${__dirname}/../data/listenActivities.txt`, 'utf-8').split('\n');


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${__dirname}/../data/listenActivities.txt`)
});

lineReader.on('line', function (line) {
  console.log('Line from file:', line);
});

// tracks.map(track => ({...track.split('<SEP>')})).forEach(track => {
//   // db.
// });
// let newListenActivities = listenActivities.map(listenActivity => ({...listenActivity.split('<SEP>')}));


mongoose.connect(mongoURI, () => {
  console.log('Successfully connected to DB!');
});

// tracks.reduce((obj, item) => {
//   console.log(item);
// });

// console.log(newTracks);
