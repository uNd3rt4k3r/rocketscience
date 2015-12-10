angular.module('rocketscienceApp')

    .controller('editCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams', 'urlFactory', 'mapFactory', function ($scope, $http, $rootScope, $state, $stateParams, urlFactory, mapFactory) {

        console.log("editCtrl started");

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $scope.isNotActive = function (route) {
            return (route !== $location.path());
        };

        $scope.newCoordinates = {'lng': 'undefined', 'lat': 'undefined'};

        $scope.setCoordinates = function () {
            if ($scope.newCoordinates.lat !== 'undefined') {
                // $scope.editUnit.coordinates = '[' +
                $scope.editUnit.coordinates = "[" + $scope.newCoordinates.lng + "," + $scope.newCoordinates.lat + "]";
            }
        }

        $scope.setEditUnit = function (id) {
            urlFactory.getOrgUnitById(id).then(function (response) {
                $scope.editUnitId = id;
                $scope.editUnit = response.data;
                if ($scope.editUnit.coordinates) {
                    var coordinate = $scope.editUnit.coordinates;
                    coordinate = coordinate.replace("[", "");
                    coordinate = coordinate.replace("]", "");
                    coordinate = coordinate.split(",");
                    var lng = coordinate[0];
                    var lat = coordinate[1];
                    $scope.newCoordinates.lat = lat;
                    $scope.newCoordinates.lng = lng;
                    var myLatLng = {initEditMarker: {lat: parseFloat(lat), lng: parseFloat(lng)}};
                    mapFactory.putSingleMarker(myLatLng);
                }
                $scope.getUnitTypes();
                console.log($scope.editUnit);
            }, function (error) {
                console.log(error);
            });
        }

        if ($stateParams.unitId != null) {
            mapFactory.setEditControllerActive(true);
            $scope.setEditUnit($stateParams.unitId);
        }

        $scope.editOrgUnit = function () {
            if ($scope.editUnit.level == 1) {
                $scope.editUnit.parent = [];
                console.log($scope.editUnit);
                $scope.saveChanges();
            } else {
                urlFactory.getOrgUnitById($scope.editUnit.parent.id).then(function (response) {
                    $scope.editUnit.parent = response.data;
                    $scope.saveChanges();
                }, function (error) {
                    console.log(error.data);
                });
            }
        }
        $scope.deleteOrgUnit = function() {
            urlFactory.deleteOrgUnit($scope.editUnit.id).then(function (response) {
                $.toaster({priority: 'success', title: 'Success', message: 'Organization Unit deleted'});
                $state.go('home.search');
            }, function (error) {
                console.log(error.data);
            });
        }
        $scope.saveChanges = function () {
            $scope.setCoordinates();
            urlFactory.editOrgUnit($stateParams.unitId, $scope.editUnit).then(function () {
                $.toaster({priority: 'success', title: 'Success', message: 'Organization Unit updated'});
                $state.go('home.search');
            }, function (error) {
                $.toaster({priority: 'danger', title: 'Error', message: error.message});
            });
        }

        $scope.getUnitTypes = function () {
            urlFactory.getLevels().then(function (response) {
                $scope.allTypes = response.data.organisationUnitLevels;
            }, function (error) {
                $.toaster({priority: 'danger', title: 'Error', message: error.data});
            });
        };

        $scope.updateParents = function () {
            switch ($scope.editUnit.level) {
                case "2":
                case "3":
                case "4":
                default:
                    urlFactory.getAllForGivenLevel($scope.editUnit.level - 1).then(function (response) {
                        $scope.allParents = response.data.organisationUnits;
                    }, function (error) {
                        $.toaster({priority: 'danger', title: 'Error', message: error.data});
                    });
                    break;
                case "1":
                case "":
                    $scope.allParents = "";
                    break;
            }

        };
        $scope.$on("$destroy", function () {
            mapFactory.setEditControllerActive(false);
            mapFactory.clearAllMarkers();
        });


        mapFactory.currentCtrlScope = $scope;
    }]);
