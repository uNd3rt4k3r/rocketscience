angular.module('rocketscienceApp')
    .factory('mapFactory', ['urlFactory',function (urlFactory) {
        console.log("mapFactory init");

        var factoryHandler = {};

        var markers = [];

        var map;

        var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(3.61,15.28),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


        //Variables for drag-drop instance
        var markerInAir = false;
        var markerOldLng; //remembers old possision of a draged marker
        var markerOldLat;

        factoryHandler.showAllOrgUnits = function() {
            //TODO: get all not just 1st page
            urlFactory.getOrgUnitOnPageNumber(1).then( function (response) {
                var allOrgUnits = response.data;

                factoryHandler.showOrgUnitsOnMap(allOrgUnits.organisationUnits);

            });
        };

        /*NOTE
         **  https://lists.launchpad.net/dhis2-users/msg00746.html **
         >> Correct me if I'm wrong, but I guess we need to clarify this once and for
         >> all :)
         >>
         >> EPSG:4326, aka WGS84, is [x, y] where
         >>
         >> x = the east-west position = longitude
         >>
         >> y = the north-south position = latitude
         >>
         */
        factoryHandler.showOrgUnitsOnMap = function(orgUnits) {
            factoryHandler.clearAllMarkers();

            for (var index in orgUnits) {
                //.hasOwnProperty('coordinates')
                urlFactory.getOrgUnitById(orgUnits[index].id).then(function (orgUnit) {
                    orgUnit = orgUnit.data;
                    if (orgUnit.hasOwnProperty('coordinates')) {
                        if (orgUnit.coordinates != null && orgUnit.coordinates != "") {

                            var coordinate = orgUnit.coordinates.replace("[","");
                            coordinate = coordinate.replace("]","");

                            var coordinates = coordinate.split(",");

                            var lng = coordinates[0];
                            var lat = coordinates[1];

                            var myLatLng = {lat: parseFloat(lat), lng: parseFloat(lng)};

                            markers.push(factoryHandler.add_marker(myLatLng,orgUnit));
                        }

                    }
                });
            }
        };

        factoryHandler.clearAllMarkers = function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        };

        factoryHandler.add_marker = function(myLatlng, orgUnit) {
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
                if (!markerInAir) {
                    markerInAir = true;
                    markerOldLng = event.latLng.lng();
                    markerOldLat = event.latLng.lat();
                }
            });

            google.maps.event.addListener(marker,'dragend',function(event) {
                //console.log("Drag stop");
                if (confirm("Save new position of "+orgUnit.name+"?")) {
                    var newCordinates = "[" + event.latLng.lng() + "," + event.latLng.lat() + "]";
                    orgUnit.coordinates = newCordinates;
                    factoryHandler.updateOrgUnit(orgUnit);

                } else {
                    var latlng = new google.maps.LatLng(markerOldLat, markerOldLng);
                    marker.setPosition(latlng);
                }

                marker.setClickable(true);
                markerInAir = false;
            });

            return marker;
            //markers.push(marker);
        };

        factoryHandler.updateOrgUnit = function(orgUnit) {
            urlFactory.editOrgUnit(orgUnit.id, orgUnit).then(function (response) {
                console.log("Organization unit updated.");
            }, function (error) {
                console.log(error);
            });
        };



        return factoryHandler;
    }]);
