const pg = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    console.log('0');
    this.client = new pg.Client('postgres://localhost:5432/poe');
    this.client.connect();
  }

  async initializeTables() {
    await this.client.query(
      'create table if not exists TRACKS (TRACK_ID VARCHAR(32), RECORDING_ID VARCHAR(32), ARTIST_NAME VARCHAR(32), TRACK_NAME VARCHAR(32))'
    );
    
    await this.client.query(
      'create table if not exists LISTEN_ACTIVITIES (TRACK_ID VARCHAR(32), USER_ID VARCHAR(32), ACTIVITY_DATE DATE)'
    );
  }

  async addTrack(track) {
    // console.log(`insert into TRACKS (TRACK_ID, RECORDING_ID, ARTIST_NAME, TRACK_NAME) values (${track.trackID}, ${track.recordingID}, ${track.artistName}, ${track.trackName})`);
    await this.client.query(
      `insert into TRACKS (TRACK_ID, RECORDING_ID, ARTIST_NAME, TRACK_NAME) values (${track.trackID}, ${track.recordingID}, ${track.artistName}, ${track.trackName})`
    );

  }

  async addListenActivity(listenActivity) {

    await this.client.query(
      `insert into LISTEN_ACTIVITIES (TRACK_ID, USER_ID, activityDate) values (${listenActivity.trackID}, ${listenActivity.userID}, ${new Date(listenActivity.date)})`
    );

  }

  findTracks() {
    return new Promise((resolve, reject) => {
      Track.find({})
        .then((tracks) => {
          resolve(tracks);
        });
    });
  }

  async quit() {
    await this.client.end();
  }
}

module.exports = Database;
