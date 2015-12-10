
angular.module('rocketscienceApp')
    .controller('addCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', 'urlFactory', 'mapFactory', function ($scope,$http,$rootScope,$state, $stateParams, urlFactory, mapFactory) {
        console.log("addCtrl started");

        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        var URL_REGEXP = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

        $scope.validEmail = true;

        $scope.validUrl = true;

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
            if ($scope.newOrgUnit.level != 1 && !$scope.newOrgUnit.parent) {
                if(!confirm("If you do not select a parent for your organization unit, the type will be set to 'national'. Are you sure you want to continue?")) {
                    return;
                }
            }

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
            console.log($scope.newOrgUnit);
             urlFactory.addOrgUnit($scope.newOrgUnit).then(function(success) {
                 $.toaster({ priority : 'success', title : 'Success', message : success.data.message});
                 showInSearch($scope.newOrgUnit.name);
             }, function(error) {
                $.toaster({ priority : 'danger', title : 'Error', message : error.message });
             });
        };

        $scope.setCoordinates = function () {
          if ($scope.newCoordinates.lat) {
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
            }
        };

        function getUnitTypes() {
            urlFactory.getLevels().then(function(success) {
                $scope.tmpTypes = success.data.organisationUnitLevels;

                if ($stateParams.newCords) {
                    mapFactory.putSingleMarker($stateParams.newCords);
                }
            }, function (error) {
                $.toaster({ priority : 'danger', title : 'Error', message : error.data});
            });
        }

        $scope.validateEmail = function () {
            if (!$scope.newOrgUnit.email) {
                $scope.validEmail = true;
            } else {
                $scope.validEmail = EMAIL_REGEXP.test($scope.newOrgUnit.email);
            }
        };

        $scope.validateUrl = function() {
            if (!$scope.newOrgUnit.url) {
                $scope.validUrl = true;
            } else {
                $scope.validUrl = URL_REGEXP.test($scope.newOrgUnit.url);
            }
        };

        $scope.$on("$destroy", function(){
            mapFactory.setAddControllerActive(false);
            mapFactory.clearAllMarkers();
        });

        function showInSearch(name) {
            $state.go('home.search', {
                unitName:name
            });
        }



        mapFactory.setAddControllerActive(true);

        mapFactory.currentCtrlScope = $scope;

        $scope.initAddCtrl();
    }]);
