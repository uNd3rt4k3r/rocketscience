
angular.module('rocketscienceApp')
    .controller('searchCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', 'urlFactory', function ($scope,$http,$rootScope,$state, $stateParams, urlFactory) {
        console.log("searchCtrl started");

        $scope.curPage = 1;

        $scope.searchParam = [];
        $scope.searchParam.organisationUnitGroups;
        $scope.searchParam.organisationUnitBorder;

        $scope.curSearchParam = [];
        $scope.curSearchParam.organisationUnitGroups;
        $scope.curSearchParam.organisationUnitBorder;

        //Variables for drag-drop instance
        $scope.markerInAir = false;
        $scope.markerOldLng; //remembers old possision of a draged marker
        $scope.markerOldLat;

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

        $scope.viewOrgUnitsOnCurPage = function() {
            urlFactory.getOrgUnitOnPageNumber($scope.curPage).then( function (response) {
                var allOrgUnits = response.data;

                $scope.showOrgUnitsOnMap(allOrgUnits.organisationUnits);

            });
        };

        $scope.showOrgUnitsOnMap = function(orgUnits) {
            markers = [];
            for (var index in orgUnits) {
                 //.hasOwnProperty('coordinates')
                 urlFactory.getOrgUnitById(orgUnits[index].id).then(function (orgUnit) {
                     orgUnit = orgUnit.data;
                     if (orgUnit.hasOwnProperty('coordinates')) {
                         if (orgUnit.coordinates != null && orgUnit.coordinates != "") {
                             var coordinate = orgUnit.coordinates.replace("[","");
                             coordinate = coordinate.replace("]","");

                             var coordinates = coordinate.split(",");
                             var lat = coordinates[0];
                             var lng = coordinates[1];
                             var myLatLng = {lat: parseInt(lat), lng: parseInt(lng)};

                             markers += $scope.add_marker(myLatLng,orgUnit);
                         }

                     }
                 });



             }
        };

        $scope.add_marker = function(myLatlng, orgUnit) {
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: orgUnit.name
            });
            marker.setClickable(true);
            marker.setAnimation(google.maps.Animation.DROP);
            marker.setDraggable(true);


            google.maps.event.addListener(marker, 'click', function (event) {
                //TODO: Show info
                console.log("Not implemented");
            });

            //marker.infowindow = infowindow;


            google.maps.event.addListener(marker,'drag',function(event) {
                if (!$scope.markerInAir) {
                    $scope.markerInAir = true;
                    $scope.markerOldLng = event.latLng.lng();
                    $scope.markerOldLat = event.latLng.lat();
                }
            });

            google.maps.event.addListener(marker,'dragend',function(event) {
                //console.log("Drag stop");
                if (confirm("Save new position of "+orgUnit.name+"?")) {
                    var newCordinates = "[" + event.latLng.lat() + "," + event.latLng.lng() + "]";
                    orgUnit.coordinates = newCordinates;
                    $scope.updateOrgUnit(orgUnit);

                } else {
                    var latlng = new google.maps.LatLng($scope.markerOldLat, $scope.markerOldLng);
                    marker.setPosition(latlng);
                }

                marker.setClickable(true);
                $scope.markerInAir = false;
            });

            return marker;
            //markers.push(marker);
        };

        $scope.updateOrgUnit = function(orgUnit) {
            urlFactory.editOrgUnit(orgUnit.id, orgUnit).then(function (response) {
                console.log("Organization unit updated.");
            }, function (error) {
                console.log(error);
            });
        };

        $scope.doSearch = function() {
            console.log("Searching...");
            console.log($scope.searchInput);
            console.log($scope.selectedBorder);
            console.log($scope.selectedGroup);
            var filter = "";

            //TODO: SEARCH
            //'name:like:' + $scope.searchInput;}


            //organisationUnitGroups.id:eq:' + $scope.selectedGroup
            //level:eq: + $scope.selectedGroup
        };

        if (baseURL !== "") {
            $scope.initSearchCtrl()
        } else {
            urlFactory.getManifest().then(function (response) {
                baseURL = response.data.activities.dhis.href + "/api";
                $scope.initSearchCtrl()
            });
        };

        $scope.initSearchCtrl = function() {
            urlFactory.getLevels().then(function (response) {
                console.log(response);
                $scope.searchParam.organisationUnitBorder = response.data.organisationUnitLevels;
                //console.log($scope.organisationUnitBorder);
            }, function (error) {
                console.log(error);
            });

            urlFactory.getGroups().then(function (response) {
                console.log(response);
                $scope.searchParam.organisationUnitGroups = response.data.organisationUnitGroups;
                //console.log($scope.organisationUnitGroups);
            }, function (error) {
                console.log(error);
            });

            $scope.viewOrgUnitsOnCurPage();
        }

    }]);
