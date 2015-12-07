
angular.module('rocketscienceApp')
    .controller('searchCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', function ($scope,$http,$rootScope,$state, $stateParams) {
        console.log("searchCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };



    }]);
