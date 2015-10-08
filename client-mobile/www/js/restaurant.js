angular.module('kwiki.restaurant', [])

//this will be where user picks the restaurant instead

// new restaurant logic

.factory('RestaurantFactory', [])

.controller('RestaurantCtrl', ['$rootScope', '$state', '$scope',
  function ($rootScope, $state, $scope) {
    $scope.restaurantData = $rootScope.restaurantData;
    // $scope.restaurantData = [
    //   {
    //     name: 'Arbys',
    //     rating: 3,
    //     distance: 1
    //   },
    //   {
    //     name: 'Taco Bell',
    //     rating: 5,
    //     distance: 2
    //   },
    //   {
    //     name: 'Chipotle',
    //     rating: 4,
    //     distance: 3
    //   }
    // ];

    $scope.choose = function(restaurant) {
      alert(restaurant.name);
    };

  }]);
