const mongoose = require('mongoose');

require('dotenv').config();

const mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
                  
// mongoose.connect('mongodb://maciejkrol:password@ds135817.mlab.com:35817/kruche_krolestwo');

const ListenActivity = require('../models/ListenActivity');
const Track = require('../models/Track');

class Database {

  constructor() {
    mongoose.connect(mongoURI, (err) => {
      if (!err) {
        console.log('Connected...');
      }
    });
  }

  addTrack(track) {

    Track.create({
      trakcID: track.trakcID,
      recordingID: track.recordingID,
      artistName: track.artistName,
      trackName: track.trackName
    }, (err, track) => {
      if (err) console.log(err);
      console.log(track);
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

}

module.exports = Database;
