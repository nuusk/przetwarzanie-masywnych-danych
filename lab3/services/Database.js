const pg = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    this.client = new pg.Client({
      // 'postgres://poe:NIEpodam123@million-song:5432'
      user: 'poe',
      host: 'db',
      database: 'million-song',
      password: 'NIEpodam123',
      port: 5432,
    });
    this.client.connect().then(() => {
      console.log('Successfully connected to db...');

      this.client.query(
        'create table if not exists TRACKS (TRACK_ID VARCHAR(32), RECORDING_ID VARCHAR(32), ARTIST_NAME VARCHAR(32), TRACK_NAME VARCHAR(32))'
      ).then(res => {
        // console.log(res);
      }).catch(err => {
        throw err;
      });
      
      this.client.query(
        'create table if not exists LISTEN_ACTIVITIES (TRACK_ID VARCHAR(32), USER_ID VARCHAR(32), ACTIVITY_DATE DATE)'
      ).then(res => {
        // console.log(res);
      }).catch(err => {
        throw err;
      });
    });
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
