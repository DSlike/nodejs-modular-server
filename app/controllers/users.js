class User {
  constructor(token, httpMethod, method) {
    this.DBCore = require('../core/db.js');
    this.httpMethod = httpMethod;
    this.method = method;

    if (token)
      this.userToken = token;

    // User defaults
    this.userModel = {
      email: null,
      name: 'Homer',
      surname: 'Simpson',
      password: '1111',
    };

    const fileName = httpMethod + '_' + method + '.js';
    const path = process.env.RootPath + 'modules/users/' + fileName;

    this[httpMethod + '' + method] = require(path);
  }
  disconnect() {
    this.DBCore.disconnect();
  }
}

module.exports = User;
