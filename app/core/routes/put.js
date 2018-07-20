const bodyParser = require('body-parser');

module.exports = function(req, callback) {
  const cpath = `${process.env.RootPath}controllers/${req.params.class}`;
  const token = req.headers.token ? req.headers.token : '';

  try {
    const CONTROL = require(cpath);
    const controller = new CONTROL(token, req.method, req.params.method, res.params.version);
    try {
      controller[req.method + '' + req.params.method](req.body, (response) => {
        controller.disconnect();
        delete controller;
        callback(response);
      });
    } catch (e) {
      console.log(req.params.class + '\t' + req.params.method + '\t' + 'FAIL');
      console.error(e);
      let response = {code: 503, body: 'Oops. Something went wrong!', error: e};
      callback(response);
    }
  } catch (e) {
    console.error(e);
    //In case of error in method - return  that Service is Unavailable
    let response = {code: 503, body: 'Oops. Something went wrong!', error: e};
    callback(response);
  }
};
