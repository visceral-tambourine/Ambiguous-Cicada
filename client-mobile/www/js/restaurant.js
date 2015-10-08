angular.module('kwiki.restaurant', [])

//this will be where user picks the restaurant instead

// new restaurant logic

.factory('RestaurantFactory', ['$state', '$rootScope', 'SocketFactory', 
    function($state, $rootScope, SocketFactory) {
      return {
        postMatch: function() {
          this.socket = SocketFactory.connect('match');
          // console.log('user: ', $rootScope.user);
          $state.go('chat');
          $rootScope.chatRoomId = 1;
          // $rootScope.$apply(function() {
          //   $state.go('chat');
          // });

          // this.socket.emit('matching', $rootScope.user);
          // this.socket.on('matched', function(data) {
          //   $rootScope.chatRoomId = data;
          //   $rootScope.$apply(function() {
          //     $state.go('chat');
          //   });
          // });
        }
      };
    }
])

.controller('RestaurantCtrl', ['$rootScope', '$state', '$scope', 'RestaurantFactory',
  function ($rootScope, $state, $scope, RestaurantFactory) {
    // this is restToClient array which is set to scope to be 
    // rendered by angular
    $scope.restaurantData = $rootScope.restaurantData;


    $scope.choose = function(restaurant) {
      $rootScope.user.restaurantName = restaurant.name;
      $state.go('load');
      RestaurantFactory.postMatch();
    };
}]);
