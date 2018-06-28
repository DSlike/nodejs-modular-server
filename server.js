'use strict';

const app = require('./app/core/app.js');

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

process.env.RootPath = __dirname + '/app/';
process.env.Core = __dirname + '/app/core/';
process.env.PrivatePath = __dirname + '/private/';
process.env.PublicPath = __dirname + '/public/';
process.env.KeysPath = __dirname + '/app/core/keys/';

process.env.APIURL = 'http://api.4fitnessgirls.net/';
process.env.MONGO_URL = 'mongodb://localhost:27017/4FitnessGirls';
process.env.DB_NAME = 'dbname';

if (process.env.NODE_ENV == 'production') {
  process.env.APIURL = 'http://yourserver/';
  process.env.MONGO_URL = 'mongodb://yourmongo/yourDB';
} else if (process.env.NODE_ENV == 'development') {
  process.env.APIURL = 'http://yourserver/';
  process.env.MONGO_URL = 'mongodb://yourmongo/yourDB';
}

require('./app/core/router.js')(app);
