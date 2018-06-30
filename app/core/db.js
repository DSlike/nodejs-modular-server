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
              this.disconnect();
              callback(err);
            } catch (e) {
              console.log(err);
            }
          }
          this.disconnect();
          callback(result);
        });
      } catch (e) {}
    });
  }
  insertMany(col, data, callback) {
    this.reconnect(()=> {
      this.DB.collection(col).insertMany(data, (err, result) => {
        this.disconnect();
        callback(result);
      });
    });
  }

  find(col, search, callback) {
    let back = (result)=> {
      this.disconnect();
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
        this.disconnect();
        callback(result);
      });
    });
  }

  findLimited(col, search, limit, callback) {
    if (search._id)
      search._id = new mongodb.ObjectId(search._id);

    this.reconnect(()=> {
      this.DB.collection(col).find(search).toArray((err, docs) => {
        if (err) {
          console.log(err);
        }
        docs = _.shuffle(docs);
        this.disconnect();
        callback(docs.slice(0, limit));
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
        this.disconnect();
        callback(docs);
      });

    });
  }
  findInDate(col, search, callback) {

    this.reconnect(()=> {
      this.DB.collection(col).find({
        userid: search.userid,
        date: {
          $gt: search.date.from,
          $lt: search.date.to
        }
      }).toArray((err, docs) => {
        if (err) {
          console.log(err);
        }
        this.disconnect();
        callback(docs);
      });

    });
  }
  update(col, search, data, callback) {

    if (search._id)
      search._id = new mongodb.ObjectId(search._id);

    this.reconnect(()=> {
      this.DB.collection(col).updateOne(search, {
        $set: data
      }, (err, result) => {
        if (err) {
          console.log(err);
        }
        this.disconnect();
        callback(result);
      });

    });
  }
  updateAll(col, search, data, callback) {

    if (search._id)
      search._id = new mongodb.ObjectId(search._id);

    if (data) {
      this.reconnect(()=> {
        this.DB.collection(col).find(search).toArray((err, docs) => {
          if (err) {
            console.log(err);
          }
          if (docs.length > 0) {
            docs.map((e, i) => {
              this.update(col, {
                _id: e._id
              }, data, (response) => {
                if (i == docs.length - 1) {
                  this.disconnect();
                  callback('done');
                }
              });
            });
          } else {
            this.disconnect();
            callback('done');
          }
        });

      });
    } else {
      this.disconnect();
      callback('done');
    }
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
