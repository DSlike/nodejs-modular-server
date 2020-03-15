const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');

app.use(helmet());
app.disable('x-powered-by');
app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.json({
  limit: '100mb',
  type: 'application/*+json',
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));

var port = process.env.PORT || 3000;

try {
  app.listen(port, function () {
    console.log('Listening on ' + port);
  });
} catch (e) {
  console.log(e);
}

module.exports = app;
