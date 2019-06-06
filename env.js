const environment = {
  production: {
    RootPath: __dirname + '/app/',
    Core: __dirname + '/app/core/',
    PrivatePath: __dirname + '/private/',
    PublicPath: __dirname + '/public/',
    KeysPath: __dirname + '/app/core/keys/',
    APIURL: 'http://api.domain.net/',
    MONGO_URL: 'mongodb://localhost:27017/database',
    DB_NAME: 'dbname',
    APIURL: 'http://yourserver/',
    MONGO_URL: 'mongodb://yourmongo/yourDB',
    version: '1.0.0'
  },

  development: {
    RootPath: __dirname + '/app/',
    Core: __dirname + '/app/core/',
    PrivatePath: __dirname + '/private/',
    PublicPath: __dirname + '/public/',
    KeysPath: __dirname + '/app/core/keys/',
    APIURL: 'http://api.domain.net/',
    MONGO_URL: 'mongodb://localhost:27017/database',
    DB_NAME: 'dbname',
    APIURL: 'http://yourserver/',
    MONGO_URL: 'mongodb://yourmongo/yourDB',
    version: '1.0.0'
  }
};

const initEnvironmentVars = () => {
  Object.keys(environment[process.env.NODE_ENV]).forEach((key, index)=> {
    if (key != 'version')
      process.env[key] = environment[process.env.NODE_ENV][key];
    else {
      process.env.APPLICATION_VERSION = parseAPIVersion(environment[process.env.NODE_ENV][key]);
    }
  });
};

const parseAPIVersion = (version) => {
  let APIV = version.split('.');
  return `${APIV[0]}.${APIV[1]}`;
};

module.exports = initEnvironmentVars();
