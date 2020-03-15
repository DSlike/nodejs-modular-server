const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MongoUrl = process.env.MONGO_URL;

class DBCore {
  constructor() {
    this.reconnect();
  }

  insert(col, data, callback) {
    this.reconnect(()=> {
      try {
        this.DB.collection(col).insert(data, (err, result) => {
          if (err) {
            try {
              callback(err);
            } catch (e) {
              console.log(err);
            }
          }

          callback(result);
        });
      } catch (e) {}
    });
  }

  find(col, search, callback) {
    let back = (result)=> {
      callback(result);
    };

    if (search._id)
      search._id = new mongodb.ObjectId(search._id);
    this.reconnect(()=> {
      this.DB.collection(col).findOne(search, (err, result) => {
        if (err) {
          console.log(err);
          try {
            global.sysLog(err, 'err');
          } catch (e) {
            console.log(err);
          }
        }

        callback(result);
      });
    });
  }

  findAll(col, search, callback) {

    if (search._id)
      search._id = new mongodb.ObjectId(search._id);

    this.reconnect(()=> {
      this.DB.collection(col).find(search).toArray((err, docs) => {
        if (err) {
          console.log(err);
        }

        callback(docs);
      });

    });
  }

  update(col, search, data, callback) {

    if (search._id)
      search._id = new mongodb.ObjectId(search._id);

    this.reconnect(()=> {
      this.DB.collection(col).updateOne(search, {
        $set: data,
      }, (err, result) => {
        if (err) {
          console.log(err);
        }

        callback(result);
      });

    });
  }

  disconnect() {
    if (this.database) {
      this.database.close();
    }

    delete this.database;
    delete this.DB;
  }

  reconnect(callback) {
    if (!this.DB)
      MongoClient.connect(process.env.MONGO_URL, (err, database) => {
        this.disconnect();
        if (database) {
          this.DB = database.db(process.env.DB_NAME);
          this.database = database;
          callback();
        } else {
          this.reconnect(()=> {
            callback();
          });
        }
      });
    else callback();
  }
};

module.exports = new DBCore();
