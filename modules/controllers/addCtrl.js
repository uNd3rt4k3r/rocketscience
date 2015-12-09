
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

        $scope.prepareNewUnit = function() {
            $scope.setCoordinates();
            if (!$scope.newOrgUnit.closedDate) {
                delete $scope.newOrgUnit.closedDate;
            }

            if(!$scope.newOrgUnit.parent) {
                addOrgUnit();
            } else {
                urlFactory.getOrgUnitById($scope.newOrgUnit.parent).then(function(success) {
                    $scope.newOrgUnit.parent = success.data;
                    addOrgUnit();
                }, function(error) {
                    console.log(error.data);
                });
            }
        };

        function addOrgUnit () {
             urlFactory.addOrgUnit($scope.newOrgUnit).then(function(success) {
                 console.log(success);
                $.toaster({ priority : 'success', title : 'Success', message : success.data.message});

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

        $scope.updateParents = function () {
            switch($scope.newOrgUnit.level) {
                case "2":
                case "3":
                case "4":
                default:
                    urlFactory.getAllForGivenLevel($scope.newOrgUnit.level - 1).then(function (success) {
                        $scope.tmpParents = success.data.organisationUnits;
                    }, function (error) {
                        $.toaster({priority: 'danger', title: 'Error', message: error.data});
                    });
                break;
                case "1":
                case "":
                    $scope.tmpParents = "";
                break;
            }

        };

        $scope.initAddCtrl = function () {
            if (baseURL !== "") {
                getUnitTypes();
            } else {
                urlFactory.getManifest().then(function (response) {
                    baseURL = response.data.activities.dhis.href + "/api";
                    getUnitTypes();
                });
            };

        };

        function getUnitTypes() {
            urlFactory.getLevels().then(function(success) {
                $scope.tmpTypes = success.data.organisationUnitLevels;
            }, function (error) {
                $.toaster({ priority : 'danger', title : 'Error', message : error.data});
            });
        };


        $scope.$on("$destroy", function(){
            mapFactory.setAddControllerActive(false);
            mapFactory.clearAllMarkers();
        });

        mapFactory.setAddControllerActive(true);

        mapFactory.currentCtrlScope = $scope;

        $scope.initAddCtrl();
    }]);
