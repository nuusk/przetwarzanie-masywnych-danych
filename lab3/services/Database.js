const { Pool, Client } = require('pg');
require('dotenv').config();
const FILE_SEPARATOR = '<SEP>'
const LineByLineReader = require('line-by-line');

const { toDoubleQuotes, formatDate } = require('../scripts/utilities');

class Database {
  constructor() {
    this.client = new Client({
      user: 'poe',
      host: 'db',
      database: 'million-song',
      password: 'NIEpodam123',
      port: 5432,
    });
    
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
  });

    // this.client.connect().then(() => {
    //   console.log('Successfully connected to db...');
    //   this.initializeDatabase();
    // });

    this.pool.connect().then(() => {
      let done = () => {
        this.client.release();
      }
    })
  }

  async initializeDatabase() {

    await this.initializeTables();
    console.log('# Tables have been initialized.');

    console.log('# Begin disable indexes procedure.')
    await this.disableIndexes();
    console.log('# Indexes have been disabled.');

    console.log('# Begin fill database procedure.')
    await this.fillDatabase();
    console.log('# Fill database ended without failure.');

    // await this.getMostPopularTracks();
  }

  reindexTables() {

    const reindexTracks = this.client.query(
      `reindex TRACKS`
    ).then(res => {
      console.log('[index] TRACKS table have been reindexed.');
    }).catch(err => {
      console.error(err);
    });

    const reindexActivities = this.client.query(
      `reindex LISTEN_ACTIVITIES`
    ).then(res => {
      console.log('[index] LISTEN_ACTIVITIES table have been reindexed.');
    }).catch(err => {
      console.error(err);
    });

    return Promise.all([reindexTracks, reindexActivities]);
  }

  initializeTables() {

    const dropTracks = this.client.query(
      `drop table if exists TRACKS`
    ).then(res => {
      console.log('[init] Successfully deleted TRACKS table.');
    }).catch(err => {
      console.error(e.stack);
    });

    const dropActivities = this.client.query(
      `drop table if exists LISTEN_ACTIVITIES`
    ).then(res => {
      console.log('[init] Successfully deleted LISTEN_ACTIVITIES table.');
    }).catch(err => {
      console.error(e.stack);
    });

    const createTracks = this.client.query(
      'create table if not exists TRACKS (TRACK_ID VARCHAR(256), RECORDING_ID VARCHAR(256), ARTIST_NAME VARCHAR(256), TRACK_NAME VARCHAR(256))'
    ).then(res => {
      console.log('[init] Successfully created TRACKS table.');
    }).catch(err => {
      console.error(e.stack);
    });
    
    const createActivities = this.client.query(
      'create table if not exists LISTEN_ACTIVITIES (TRACK_ID VARCHAR(256), USER_ID VARCHAR(256), ACTIVITY_DATE DATE)'
    ).then(res => {
      console.log('[init] Successfully created LISTEN_ACTIVITIES table.');
    }).catch(err => {
      console.error(e.stack);
    });

    return Promise.all([
      dropTracks,
      dropActivities,
      createTracks,
      createActivities
    ]);
  }

  enableIndexes() {
    
    const enableIndexActivities = this.client.query(
      `UPDATE pg_index
      SET indisready=true
      WHERE indrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname='LISTEN_ACTIVITIES'
      )`
    ).then(() => {
      console.log('[index] Indexes on LISTEN_ACTIVITIES table have been enabled.');
    }).catch(err => {
      console.error(err);
    });

    const enableIndexTracks = this.client.query(
      `UPDATE pg_index
      SET indisready=true
      WHERE indrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname='TRACKS'
      )`
    ).then(() => {
      console.log('[index] Indexes on TRACKS table have been enabled.');
    }).catch(err => {
      console.error(err);
    });

    return Promise.all([enableIndexActivities, enableIndexTracks]);
  }



  disableIndexes() {
    
    const disableIndexActivities = this.client.query(
      `UPDATE pg_index
      SET indisready=false
      WHERE indrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname='LISTEN_ACTIVITIES'
      )`
    ).then(() => {
      console.log('[index] Indexes on LISTEN_ACTIVITIES table have been disabled.');
    }).catch(err => {
      console.error(err);
    });

    const disableIndexTracks = this.client.query(
      `UPDATE pg_index
      SET indisready=false
      WHERE indrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname='TRACKS'
      )`
    ).then(() => {
      console.log('[index] Indexes on TRACKS table have been disabled.');
    }).catch(err => {
      console.error(err);
    });

    return Promise.all([disableIndexActivities, disableIndexTracks]);
  }

  fillDatabase() {
    const files = [`${__dirname}/../listenActivities.txt`, `${__dirname}/../tracks.txt`];
    
    const activityPromise = new Promise((resolve, reject) => {
      const activitiesLineReader = new LineByLineReader(files[0]);
      
      activitiesLineReader.on('error', err => {
        reject(err);
      });
      
      activitiesLineReader.on('line', line => {
        const splitted = line.split(FILE_SEPARATOR);
      
        const newActivity = {
          userID: splitted[0],
          trackID: splitted[1],
          date: splitted[2]
        }
  
        this.addListenActivity(newActivity);
      });
      
      activitiesLineReader.on('end', () => {
        console.log('[fill] All lines are read, file <listenActivities.txt> is closed now.');
        resolve();
      });
    })

    const trackPromise = new Promise((resolve, reject) => {
      const tracksLineReader = new LineByLineReader(files[1]);
  
      tracksLineReader.on('error', err => {
        reject(err);
      });
      
      tracksLineReader.on('line', line => {
        const splitted = line.split(FILE_SEPARATOR);
      
        const newTrack = {
          trackID: splitted[1],
          recordingID: splitted[0],
          artistName: splitted[2],
          trackName: splitted[3],
        }
        
        this.addTrack(newTrack);
      });
      
      tracksLineReader.on('end', () => {
        console.log('[fill] All lines are read, file <tracks.txt> is closed now.');
        resolve();
      });
    });

    return Promise.all([activityPromise, trackPromise]);
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
