var baseURL = "";
//var findMeCoords = {};
//var orgDetails = {};
//var searchOrgMarkers = {};

angular.module('rocketscienceApp')
    .controller('mainCtrl', ['$scope','$http','$rootScope','$state', '$window','urlFactory', function ($scope,$http,$rootScope,$state,$window,urlFactory) {
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

        $scope.getState = function(){
            return $state.current.name;
        };

        $scope.setBaseUrlAndInitState = function() {
             urlFactory.getManifest().then(function (response) {
                 baseURL = response.data.activities.dhis.href + "/api";
                 $scope.initState();
             });
        };

        $scope.gotoDashboard = function() {
            $window.location.href = baseURL + "/../";
        };

        $scope.refreshPage = function() {
            $window.location.reload();
        }


    }]);
