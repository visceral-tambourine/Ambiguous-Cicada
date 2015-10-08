angular.module('kwiki.restaurant', [])

//this will be where user picks the restaurant instead

// new restaurant logic

.factory('RestaurantFactory', [])

.controller('RestaurantCtrl', ['$rootScope', '$state', '$scope',
  function ($rootScope, $state, $scope) {
    // this is restToClient array which is set to scope to be 
    // rendered by angular
    $scope.restaurantData = $rootScope.restaurantData;


    $scope.choose = function(restaurant) {
      alert(restaurant.name);
    };

  }]);
