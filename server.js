'use strict';

const app = require('./app/core/app.js');

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

require('./env');
require('./app/core/router.js')(app);
