angular.module('kwiki.match', [])


//this will be where user picks the restaurant instead

// new restaurant logic
                                         
.factory('MatchFactory', ['$state', 'SocketFactory', '$window', '$rootScope', 
  function ($state, SocketFactory, $window, $rootScope) {
    var matchFact = {};

    matchFact.connectSocket = function () {
      this.socket = SocketFactory.connect("match");
  };

    matchFact.postMatch = function () {
      this.socket.emit('matching', $rootScope.user);
      this.socket.on('matched', function (data) {
        $rootScope.chatRoomId = data;
        $rootScope.$apply(function () {
          $state.go('chat');
        });
      });
  };

  return matchFact;
}])

.controller('MatchCtrl', ['$rootScope', '$state', '$scope', 'MatchFactory', 'AuthFactory', '$window', 
  function ($rootScope, $state, $scope, MatchFactory, AuthFactory, $window) {
    $rootScope.disableButton = false;
    $scope.locationLoad;

    $scope.getLocation = function() {
      if ('geolocation' in $window.navigator) {
        $window.navigator.geolocation.getCurrentPosition(function(position) {
          $rootScope.user.location = position.coords.latitude + ',' + position.coords.longitude;
          MatchFactory.postMatch();
          console.log('YOU ARE HERE: ', $rootScope.user.location);
        });
      }
    };

    $scope.connect = function() {
      MatchFactory.connectSocket();
    };

    // $scope.submit = function () {
    //   $rootScope.disableButton = true;
    //   MatchFactory.postMatch();
    //   $state.go('load');
    // };

    $scope.logOut = function () {
      $rootScope.disableButton = false;
      AuthFactory.logOut();
    };

    if ($state.current.name === 'location-load') {
      $scope.getLocation();
      $scope.locationLoad = false;
    }
}]);
