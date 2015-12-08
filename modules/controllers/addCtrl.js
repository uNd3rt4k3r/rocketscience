
angular.module('rocketscienceApp')
    .controller('addCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', 'urlFactory', 'mapFactory', function ($scope,$http,$rootScope,$state, $stateParams, urlFactory, mapFactory) {
        console.log("addCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

        $scope.newOrgUnit = {};
        $scope.newLatitude;
        $scope.newLongitude;

        $scope.addOrgUnit = function() {
            console.log($scope.newOrgUnit);
        };

        $scope.findme = function() {
          mapFactory.putSingleMarkerAsCurLocation();
        };

        $scope.$on("$destroy", function(){
            mapFactory.setAddControllerActive(false);
            mapFactory.clearAllMarkers();
        });

        mapFactory.setAddControllerActive(true);

    }]);
