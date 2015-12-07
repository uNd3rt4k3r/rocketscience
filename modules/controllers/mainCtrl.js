var baseURL = "";
//var findMeCoords = {};
//var orgDetails = {};
//var searchOrgMarkers = {};

angular.module('rocketscienceApp')
    .controller('mainCtrl', ['$scope', '$http','$rootScope','$state','urlFactory', function ($scope,$http,$rootScope,$state,urlFactory) {
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
            $state.go('home.search');
        };

        $scope.setState = function (action) {
            $state.go(action);
        };

        $scope.setBaseUrl = function() {
             urlFactory.getBaseUrl().then( function (response) {
                 baseURL = response.data.activities.dhis.href;
             });
        };

        $scope.setBaseUrl();
    }]);
