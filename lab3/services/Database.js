const ListenActivity = require('../models/ListenActivity');
const Track = require('../models/Track');

class Database {

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

  async addTrack(listenActivity) {
        
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
