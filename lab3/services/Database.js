const mongoose = require('mongoose');

require('dotenv').config();

const mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
const ListenActivity = require('../models/ListenActivity');
const Track = require('../models/Track');

class Database {

  static initializeConnection() {
    mongoose.connect(mongoURI, { useNewUrlParser: true }, (err) => {
      if (!err) {
        console.log('Successfully Connected to the database...');
      }
    });
  }

  async addTrack(track) {

    Track.create({
      trakcID: track.trakcID,
      recordingID: track.recordingID,
      artistName: track.artistName,
      trackName: track.trackName
    }, (err) => {
      if (err) throw err;
    });

  }

  async addListenActivity(listenActivity) {
        
    ListenActivity.create({
      userID: listenActivity.userID,
      trackID: listenActivity.trackID,
      date: listenActivity.date
    }, (err) => {
      if (err) throw err;
    });

  }

  findTracks() {
    return new Promise((resolve, reject) => {
      Track.find({})
        .then((tracks) => {
          resolve(tracks);
        });
    });
  }

}

module.exports = Database;
