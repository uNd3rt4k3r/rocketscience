angular.module('rocketscienceApp')
    .factory('mapFactory', ['$state','urlFactory', function ($state,urlFactory) {
        console.log("mapFactory init");

        var factoryHandler = {};

        //Variables for controllers
        factoryHandler.currentCtrlScope;

        var addControllerActive = false;
        var searchControllerActive = false;
        var editControllerActive = false;


        factoryHandler.setAddControllerActive = function(value) {
            addControllerActive = value;
        };

        factoryHandler.setSearchControllerActive = function(value) {
            searchControllerActive = value;
        };

        factoryHandler.setEditControllerActive = function(value) {
            editControllerActive = value;
        };

        //map
        var markers = [];

        var map;

        var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(3.61,15.28),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        //Variables for drag-drop instance
        var markerOldLng; //remembers old possision of a draged marker
        var markerOldLat;

        var singleMarker;

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        map.addListener('click', function(event) {
            if (addControllerActive || editControllerActive) {
                factoryHandler.putSingleMarker(event);
            } else if (searchControllerActive) {
                $state.go('home.add', {
                    newCords:event
                });
            }
        });

        factoryHandler.putSingleMarker = function(position) {
            var lat;
            var lng;
            var markerLabelText = 'New Org. Unit'

            if (editControllerActive) markerLabelText = 'Drag to edit';

            if (position.hasOwnProperty('latLng')) { //on map click
                lat = position.latLng.lat();
                lng = position.latLng.lng();
            } else if (position.hasOwnProperty('initEditMarker')) { //current location
                lat = position.initEditMarker.lat;
                lng = position.initEditMarker.lng;
            } else { //current location
                lat = position.coords.latitude;
                lng = position.coords.longitude;
            }

            var myLatlng = new google.maps.LatLng(lat, lng);

            if (typeof singleMarker !== 'undefined') {
                singleMarker.setMap(null);
            }

            singleMarker = new MarkerWithLabel({
                position: myLatlng,
                map: map,
                draggable: true,
                labelContent: markerLabelText,
                labelAnchor: new google.maps.Point(50, -2),
                labelClass: "markerStyle", // the CSS class for the label
                labelStyle: {opacity: 0.75}
            });

            map.panTo(myLatlng);

            google.maps.event.addListener(singleMarker,'drag',function(event) {
                dragLat = event.latLng.lat();
                dragLng = event.latLng.lng();

                factoryHandler.currentCtrlScope.$evalAsync(function(){
                    factoryHandler.currentCtrlScope.newCoordinates.lat = dragLat;
                    factoryHandler.currentCtrlScope.newCoordinates.lng = dragLng;
                });
                //factoryHandler.currentCtrlScope.newCoordinates.lat = dragLat;
                //factoryHandler.currentCtrlScope.newCoordinates.lng = dragLng;
                //factoryHandler.currentCtrlScope.$apply();
            });

            factoryHandler.currentCtrlScope.$evalAsync(function(){
                factoryHandler.currentCtrlScope.newCoordinates.lat = lat;
                factoryHandler.currentCtrlScope.newCoordinates.lng = lng;
            });
            //factoryHandler.currentCtrlScope.newCoordinates.lat = lat;
            //factoryHandler.currentCtrlScope.newCoordinates.lng = lng;
            //factoryHandler.currentCtrlScope.$apply();


            return myLatlng;

        };

        factoryHandler.putSingleMarkerAsCurLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(factoryHandler.putSingleMarker);
            } else {
                alert("Well this is awkward, we can't find your location.");
            }
        };

        //Variables for drag-drop instance
        var markerInAir = false;
        var markerOldLng; //remembers old possision of a draged marker
        var markerOldLat;

        //DEPRECATED
        factoryHandler.showAllOrgUnits = function() {
            urlFactory.getOrgUnitOnPageNumber(1).then( function (response) {
                var allOrgUnits = response.data;

                factoryHandler.showOrgUnitsOnMap(allOrgUnits.organisationUnits);

            });
        };

        /*NOTE regarding wrong lat lng
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

            if (typeof singleMarker !== 'undefined') {
                singleMarker.setMap(null);
            }
        };

        factoryHandler.add_marker = function(myLatlng, orgUnit) {
            var marker = new MarkerWithLabel({
                position: myLatlng,
                map: map,
                title: "Drag to edit position. Click to edit info.",
                labelContent: orgUnit.name,
                labelAnchor: new google.maps.Point(50, -2),
                labelClass: "markerStyle", // the CSS class for the label
                labelStyle: {opacity: 0.75}
            });
            marker.setClickable(true);
            marker.setAnimation(google.maps.Animation.DROP);
            marker.setDraggable(true);


            google.maps.event.addListener(marker, 'click', function (event) {
                $state.go('home.edit', {
                    unitId:orgUnit.id
                });
            });

            //marker.infowindow = infowindow;


            google.maps.event.addListener(marker,'dragstart',function(event) {
                    markerOldLng = event.latLng.lng();
                    markerOldLat = event.latLng.lat();
            });

            google.maps.event.addListener(marker,'dragend',function(event) {

                if (confirm("Save new position of "+orgUnit.name+"?")) {
                    var newCordinates = "[" + event.latLng.lng() + "," + event.latLng.lat() + "]";
                    orgUnit.coordinates = newCordinates;
                    factoryHandler.updateOrgUnit(orgUnit);

                } else {
                    var latlng = new google.maps.LatLng(markerOldLat, markerOldLng);
                    marker.setPosition(latlng);
                }

                marker.setClickable(true);
            });

            google.maps.event.addListener(marker, 'mouseover', function(event) {
                    marker.labelClass = "markerStyleHover";
                    marker.label.setStyles();
            });

            google.maps.event.addListener(marker, 'mouseout', function(event) {
                    marker.labelClass = "markerStyle";
                    marker.label.setStyles();
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
