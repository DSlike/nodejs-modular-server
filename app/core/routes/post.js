const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports = function(req, callback) {
  const cpath = `${process.env.RootPath}controller/${req.params.class}`;
  const token = req.headers.token ? req.headers.token : '';
  let contype = req.headers['content-type'];

  if (!contype) contype = 'x-www-form-urlencoded';

  try {
    const CONTROL = require(cpath);
    const controller = new CONTROL(token, req.method, req.params.method, res.params.version);
    if (contype.indexOf('application/json') >= 0 ||
      contype.indexOf('x-www-form-urlencoded') >= 0) {
      // JSON
      try {
        controller[req.method + '' + req.params.method](req.body, (response) => {
          controller.disconnect();
          delete controller;
          callback(response);
        });
      } catch (e) {
        console.log(req.params.class + '\t' + req.params.method + '\t' + 'FAIL');
        console.error(e);
        let response = {
          code: 503,
          body: 'Oops. Something went wrong!',
          error: e
        };
        callback(response);
      }
    } else {
      //multipart form-data
      const form = new formidable.IncomingForm();
      const formRouter = require(process.env.Core + 'routes/formPOST.js');
      formRouter(req, form, (fields, fileName) => {
        if (fileName)
          fields.image = fileName;
        try {
          controller[req.method + '' + req.params.method](fields, (response) => {
            if (response.code == 409) {
              let unlinkFile = path.join(process.env.PublicPath, 'filesPath/' + fileName);
              fs.unlink(unlinkFile, (err, result) => {
                err && console.log(err);
              });
            }
            controller.disconnect();
            delete controller;
            callback(response);
          });
        } catch (e) {
          console.log(req.params.class + '\t' + req.params.method + '\t' + 'FAIL');
          console.error(e);
          let response = {
            code: 503,
            body: 'Oops. Something went wrong!',
            error: e
          };
          callback(response);
        }
      });
    }
  } catch (e) {
    console.error(e);
    //In case of error in method - return  that Service is Unavailable
    let response = {
      code: 503,
      body: 'Oops. Something went wrong!',
      error: e
    };
    callback(response);
  }
};
