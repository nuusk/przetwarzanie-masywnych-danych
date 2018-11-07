const fs = require('fs');
const Database = require('../services/Database');
const FILE_SEPARATOR = '<SEP>'

// const mongoose = require('mongoose');

// const tracks = fs.readFileSync(`${__dirname}/../data/tracks.txt`, 'utf-8').split('\n');
// const listenActivities = fs.readFileSync(`${__dirname}/../data/listenActivities.txt`, 'utf-8').split('\n');

const db = new Database();

const listenActivitiesReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${__dirname}/../data/listenActivities.txt`)
});

listenActivitiesReader.on('line', line => {
  // console.log('Line from file:', line);
});

const trackReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${__dirname}/../data/tracks.txt`)
});

trackReader.on('line', line => {
  // console.log(line);
  const splitted = line.split(FILE_SEPARATOR);

  const newTrack = {
    trakcID: splitted[0],
    recordingID: splitted[1],
    artistName: splitted[2],
    trackName: splitted[3],
  }
  // console.log(newTrack);
  db.addTrack(newTrack);
});

// tracks.map(track => ({...track.split('<SEP>')})).forEach(track => {
//   // db.
// });
// let newListenActivities = listenActivities.map(listenActivity => ({...listenActivity.split('<SEP>')}));




// tracks.reduce((obj, item) => {
//   console.log(item);
// });

// console.log(newTracks);
