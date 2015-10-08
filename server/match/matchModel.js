var chatController = require('../chat/chatController');

var MatchModel = function(matcher) {
  this._matcher = matcher;
  this._size = 0;
  this.users = [];
};

MatchModel.prototype.join = function(user) {
      console.log("its a jobby loined good time");
      this._match(user);
}.bind(this);

MatchModel.prototype.leave = function(user) {
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i] === user){
        resolve(this.users.splice(i,1)[0]);
        this._size--;
      }
    }
    reject(new ReferenceError('User '+ user +' not found in lobby'));
  }.bind(this));
};

MatchModel.prototype._add = function(user) {
  return new Promise(function(resolve, reject) {
    if(this._isDuplicate(user)){
      reject(new Error('User is already in the lobby'));
    }
    this.users.push(user);

    resolve(user);
  }.bind(this));
};

MatchModel.prototype._isDuplicate = function(user) {
  for (var i = 0; i < this.users.length; i++) {
    if (this.users[i].id === user.id) {
      return true;
    }
  }
  return false;
};

MatchModel.prototype.match = function(user) {
  var toBeMatched = [];
  if (this.users.length > 0) {
    for (var i = 0; i < this.users.length; i++) {
      if(this.users[i].restaurantName === user.restaurantName){
        toBeMatched.push(this.users[i]);
        this.leave(this.users[i]);
        toBeMatched.push(user);
        chatController.createChat(toBeMatched);
      }
    }
  } else {
      this.users.push(user);
  }
};

module.exports = MatchModel;
