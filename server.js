'use strict';

const cluster = require('cluster');

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

const numCPUs = process.env.NODE_ENV == 'development' ? 1 : require('os').cpus().length * 2;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

} else {
  const app = require('./app/core/app.js');

  require('./env');
  require('./app/core/router.js')(app);
}
