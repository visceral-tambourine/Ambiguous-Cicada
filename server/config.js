var config = {

  development: {
    dbpath: 'mongodb://localhost/kwikidev',
    port: 3000,
    api_keys: {
      geocoding: process.env.APIKEY_GEOCODING || 'AIzaSyBZGjKmctGCiNwuYFEbSa9tr-y8Ot_E6FY',
    }
  },

  production: {
    dbpath: process.env.MONGOLAB_URI,
    port: process.env.PORT || 3000,
    api_keys: {
      geocoding: process.env.APIKEY_GEOCODING,
    }
  }

};

// Set current environment here
module.exports = config[process.env.NODE_ENV || 'development'];
