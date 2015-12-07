var baseURL = "";
//var findMeCoords = {};
//var orgDetails = {};
//var searchOrgMarkers = {};

angular.module('rocketscienceApp')
    .controller('mainCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', function ($scope,$http,$rootScope,$state, $stateParams) {
        console.log("mainCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

        $scope.initState = function () {
            console.log($state);
            $state.go('home.search');

        }

        $scope.setState = function (action) {
            console.log(action);
            $state.go(action);
        }

    }]);
