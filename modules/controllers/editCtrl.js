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
                    var myLatLng = {initEditMarker:{lat: parseFloat(lat), lng: parseFloat(lng)}};
                    mapFactory.putSingleMarker(myLatLng);
                }
                console.log(response.data);
            }, function (error) {
                console.log(error);
            });
        }

        if ($stateParams.unitId != null) {
            $scope.setEditUnit($stateParams.unitId);
        }

        $scope.EditOrgUnit = function () {
            $scope.setCoordinates();
            urlFactory.editOrgUnit($stateParams.unitId,$scope.editUnit).then(function() {
                $.toaster({ priority : 'success', title : 'Success', message : 'Organization Unit updated'});
                $state.go('home.search');
            }, function(error) {
                $.toaster({ priority : 'danger', title : 'Error', message : error.message });
            });
        }

        $scope.$on("$destroy", function(){
            mapFactory.setAddControllerActive(false);
            mapFactory.clearAllMarkers();
        });


        mapFactory.setAddControllerActive(true);
        mapFactory.currentCtrlScope = $scope;
    }]);
