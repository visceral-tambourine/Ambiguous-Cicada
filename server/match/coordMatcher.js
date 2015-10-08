var apiKey = require("../config.js").api_keys.geocoding;
var https = require("https");

var coordMatcher = function(roomSize, maxDist) {
  this.roomSize = 2;
  this.maxDist = 3;
};

coordMatcher.prototype.preMatch = function(user) {
  return this._getCoords(user.address)
    .then(function(coords) {
      user.coords = coords;
      return user;
    });
};

//something something, keep track of what restaurant the user selected

//store it on the user object

//add user into pool of users that have selected a restaurant
//check to see if anyone in the pool has the same selection
//if so, do the damn thing and match 'em

//every time a user selects a restaurant, its checked against all users in the pool
//not web scale. at some point, pools would have to be localized, so there would be a san fran pool etc etc
//once the users are matched the underlying architecture should do the rest and get them into a room





coordMatcher.prototype.match = function(users) {
  return new Promise(function (resolve, reject) {

    for (var i = 0; i < users.length; i++) {
      for (var j = i+1; j < users.length; j++) {

        if(this._isMatch(users[i], users[j])){
          resolve([ users[i], users[j] ]);
        }

      }
    }

  }.bind(this));
};

coordMatcher.prototype._isMatch = function(userA, userB) {
  return this._getDistance(userA.coords, userB.coords) < this.maxDist;
};

coordMatcher.prototype._encodeAddress = function (addressString) {

  //all special characters and their respective url encodings
  var specials = {
    " ": "%20", "#": "%23", "$": "%24", "%": "%25", "&": "%26", "@": "%40", "`": "%60", "/": "%2F", ":": "%3A",
    ";": "%3B", "<": "%3C", "=": "%3D", ">": "%3E", "?": "%3F", "[": "%5B", "\\": "%5C", "]": "%5D", "^": "%5E",
    "{": "%7B", "|": "%7C", "}": "%7D", "~": "%7E", "\“": "%22", "‘": "%27", "+": "%2B", ",": "%2C",
  };

  //replace all special characters in addressString with their url encodings and return the encoded string
  return addressString.split('').map(function (char) {
    return specials[char] || char;
  }).join('');
};

coordMatcher.prototype._getCoords = function (addressString) {

  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + this._encodeAddress(addressString) +  "&key=" + apiKey;

  return new Promise(function(resolve, reject) {

    https.get(url, function (res) {
      var buffer = "";
      var e = null;
      res.on('data', function (data) {
        buffer += data;
      });
      res.on('end', function () {

        var results = JSON.parse(buffer).results;
        //its possible (thought hasn't happend in testing yet) that maps will give back multiple results
        if (results.length === 0) {
          reject(new Error('Address not found.'));
        } else if (results.length > 1) {
          reject(new Error('Address too vague.'));
        } else {
          resolve(results[0].geometry.location);
        }
      });
    }).on('error', function () {
      reject(new Error("Error with geocoding API"));
    });

  });
};

coordMatcher.prototype._getDistance = function(coordsA, coordsB) {

  var R = 3958.7558657440545; // Radius of earth in Miles
  var toRad = function (degrees) {
    // Converts numeric degrees to radians
    return degrees * Math.PI / 180;
  };

  var dLat = toRad(coordsB.latitude - coordsA.latitude);
  var dLng = toRad(coordsB.longitude - coordsA.longitude);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(toRad(coordsA.latitude)) * Math.cos(toRad(coordsB.latitude)) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var dist = R * c;

  return dist;
};

module.exports = coordMatcher;
