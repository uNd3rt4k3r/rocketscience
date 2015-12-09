
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

        $scope.newCoordinates = { 'lng' : 'undefined' , 'lat' : 'undefined' };

        $scope.addOrgUnit = function() {

            $scope.setCoordinates();
            if ($scope.newOrgUnit.closedDate == null) {
                delete $scope.newOrgUnit.closedDate;
            }

            urlFactory.addOrgUnit($scope.newOrgUnit).then(function() {
                $.toaster({ priority : 'success', title : 'Success', message : 'New Organization Unit added'});

            }, function(error) {
                $.toaster({ priority : 'danger', title : 'Error', message : error.message });
            });


        };

        $scope.setCoordinates = function () {
          if ($scope.newCoordinates.lat !== 'undefined') {
              $scope.newOrgUnit.coordinates = "[" + $scope.newCoordinates.lng + "," + $scope.newCoordinates.lat + "]";
          }
        };

        $scope.findme = function() {
            mapFactory.putSingleMarkerAsCurLocation();
        };


        $scope.$on("$destroy", function(){
            mapFactory.setAddControllerActive(false);
            mapFactory.clearAllMarkers();
        });

        mapFactory.setAddControllerActive(true);

        mapFactory.currentCtrlScope = $scope;

    }]);
