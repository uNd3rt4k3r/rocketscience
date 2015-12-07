var baseURL = "";
//var findMeCoords = {};
//var orgDetails = {};
//var searchOrgMarkers = {};

angular.module('rocketscienceApp')
    .controller('MainCtrl', ['$scope', '$location', '$route', function ($scope, $location, $route) {
        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

    }]);
