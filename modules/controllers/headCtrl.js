angular.module('rocketscienceApp')
    .controller('headCtrl', ['$scope','$http','$rootScope', '$window','urlFactory', function ($scope,$http,$rootScope,$window,urlFactory) {
        console.log("headCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

        $scope.gotoDashboard = function() {
            $window.location.href = baseURL + "/../";
        };

        $scope.refreshPage = function() {
            $window.location.reload();
        }


    }]);
