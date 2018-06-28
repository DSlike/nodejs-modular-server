const DB = require('./db.js');

module.exports = (app) => {

  // Here is can be some other routes

  try {
    app.route('/API/:class/:method')
      .get((req, res) => {
        let route = require(`${process.env.Core}routes/get.js`);
        console.log('> GET', req.params.class, req.params.method);
        route(req, (response) => {
          res.status(response.code).send(response.body);
        });
      })
      .post((req, res) => {
        let route = require(`${process.env.Core}routes/post.js`);
        console.log('> POST', req.params.class, req.params.method);
        route(req, (response) => {
          res.status(response.code).send(response.body);
        });
      })
      .put((req, res) => {
        let route = require(`${process.env.Core}routes/put.js`);
        console.log('> PUT', req.params.class, req.params.method);
        route(req, (response) => {
          res.status(response.code).send(response.body);
        });
      });
  } catch (e) {
    console.log(e);
  }
};
