
angular.module('rocketscienceApp')
    .controller('addCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', function ($scope,$http,$rootScope,$state, $stateParams) {
        console.log("addCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };



    }]);
