const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = function(data, callback) {
  this.DBCore.find('users', data, (res)=> {
    if (res == null) {
      callback({code: 404, body: {message: 'User not found'}});
    } else {
      const cert = fs.readFileSync(`${process.env.KeysPath}token.key`, 'utf-8');
      const uid = res._id.toString();
      const token = jwt.sign({_id: uid}, cert);

      let user = res;

      delete user.password;

      callback({
        code: 200,
        body: {
          token: token,
          user: user
        }
      });
    }
  });
};
