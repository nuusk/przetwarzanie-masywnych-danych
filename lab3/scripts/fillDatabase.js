const Database = require('../services/Database');
const readLine = require('readline');
const FILE_SEPARATOR = '<SEP>'

const db = new Database();
db.constructor.initializeConnection();

const listenActivitiesReader = readLine.createInterface({
  input: require('fs').createReadStream(`${__dirname}/../listenActivities.txt`)
});

listenActivitiesReader.on('line', line => {
  const splitted = line.split(FILE_SEPARATOR);

  const newActivity = {
    userID: splitted[0],
    trackID: splitted[1],
    date: splitted[2]
  }

  db.addListenActivity(newActivity);
});

const trackReader = readLine.createInterface({
  input: require('fs').createReadStream(`${__dirname}/../tracks.txt`)
});

trackReader.on('line', line => {
  const splitted = line.split(FILE_SEPARATOR);

  const newTrack = {
    trakcID: splitted[0],
    recordingID: splitted[1],
    artistName: splitted[2],
    trackName: splitted[3],
  }

  db.addTrack(newTrack);
});