const { Pool, Client } = require('pg');
require('dotenv').config();
const FILE_SEPARATOR = '<SEP>'
const LineByLineReader = require('line-by-line');

const { toDoubleQuotes, formatDate } = require('../scripts/utilities');

class Database {
  constructor() {
    this.client = new Client({
      // 'postgres://poe:NIEpodam123@million-song:5432'
      user: 'poe',
      host: 'db',
      database: 'million-song',
      password: 'NIEpodam123',
      port: 5432,
    });

    this.client.connect().then(() => {
      console.log('Successfully connected to db...');
      this.initializeDatabase();
    });
  }

  async initializeDatabase() {
    // await this.initializeTables();
    // await this.fillDatabase();
    await this.getMostPopularTracks();
  }

  async initializeTables() {
    await this.client.query(
      `drop table if exists TRACKS`
    ).then(res => {
      console.log('Successfully deleted TRACKS table.');
    }).catch(err => {
      console.error(e.stack);
    });

    await this.client.query(
      `drop table if exists LISTEN_ACTIVITIES`
    ).then(res => {
      console.log('Successfully deleted LISTEN_ACTIVITIES table.');
    }).catch(err => {
      console.error(e.stack);
    });

    await this.client.query(
      'create table if not exists TRACKS (TRACK_ID VARCHAR(256), RECORDING_ID VARCHAR(256), ARTIST_NAME VARCHAR(256), TRACK_NAME VARCHAR(256))'
    ).then(res => {
      console.log('Successfully created TRACKS table.');
    }).catch(err => {
      console.error(e.stack);
    });
    
    await this.client.query(
      'create table if not exists LISTEN_ACTIVITIES (TRACK_ID VARCHAR(256), USER_ID VARCHAR(256), ACTIVITY_DATE DATE)'
    ).then(res => {
      console.log('Successfully created LISTEN_ACTIVITIES table.');
    }).catch(err => {
      console.error(e.stack);
    });
  }

  async fillDatabase() {
    const files = [`${__dirname}/../listenActivities.txt`, `${__dirname}/../tracks.txt`];
    const lr = new LineByLineReader(files[0]);
    const lr2 = new LineByLineReader(files[1]);
    
    lr.on('error', function (err) {
      // 'err' contains error object
    });
    
    lr.on('line', line => {
      const splitted = line.split(FILE_SEPARATOR);
    
      const newActivity = {
        userID: splitted[0],
        trackID: splitted[1],
        date: splitted[2]
      }

      this.addListenActivity(newActivity);
    });
    
    lr.on('end', function () {
      console.log('all lines are read, file listenActivities is closed now.');
    });

    lr2.on('error', function (err) {
      // 'err' contains error object
    });
    
    lr2.on('line', line => {
      const splitted = line.split(FILE_SEPARATOR);
    
      const newTrack = {
        trackID: splitted[0],
        recordingID: splitted[1],
        artistName: splitted[2],
        trackName: splitted[3],
      }
       
      this.addTrack(newTrack);
    });
    
    lr2.on('end', function () {
      console.log('all lines are read, file tracks is closed now.');
    });
    
   }

  async getMostPopularTracks() {
    const tracks = await this.client.query(
      'select * from LISTEN_ACTIVITIES'
      // 'select TRACK_NAME, ARTIST_NAME, count(*) as occ from TRACKS join LISTEN_ACTIVITIES using(TRACK_ID) group by (ARTIST_NAME, TRACK_NAME) order by occ desc fetch first 10 rows only'
    );
    
    console.log(tracks);

    tracks.rows.forEach(track => {
      console.log(track);
      // console.log(`${track.track_name} ${track.artist_name} ${track.track_name}`);
    });
  }

  async addTrack(track) {

    await this.client.query(
      `insert into TRACKS ( \
        TRACK_ID, RECORDING_ID, ARTIST_NAME, TRACK_NAME \
      ) values ( \
        '${track.trackID}', '${track.recordingID}', '${toDoubleQuotes(track.artistName)}', '${toDoubleQuotes(track.trackName)}' \
      )`
    );
  }

  async addListenActivity(listenActivity) {
    console.log(`insert into LISTEN_ACTIVITIES ( \
      TRACK_ID, USER_ID, ACTIVITY_DATE \
    ) values ( \
      '${listenActivity.trackID}', '${listenActivity.userID}', '${formatDate(listenActivity.date)}'::date \
    )`);
    await this.client.query(
      `insert into LISTEN_ACTIVITIES ( \
        TRACK_ID, USER_ID, ACTIVITY_DATE \
      ) values ( \
        '${listenActivity.trackID}', '${listenActivity.userID}', '${formatDate(listenActivity.date)}'::date \
      )`
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
