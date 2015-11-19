function get_location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(location_found);
    } else {
        //window.alert("Browser doesn't support Geolocation");
    }
}

//Updates textboxes with position data
function setLocation(position) {
    var lat = position.lat();
    var lon = position.lng();
    var txtLatitude = document.getElementById('lat');
    var txtLongitude = document.getElementById('lon');

    txtLatitude.value = lat;
    txtLongitude.value = lon;
}

var map;
function initialize_map() {
    //Test data
    var myLatlng = new google.maps.LatLng(-34.397, 150.644);

    var mapOptions = {
        center: myLatlng,
        scrollwheel: false,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.Marker({
        position: {lat: -34.397, lng: 150.644},
        map: map,
    });

    setLocation(myLatlng);
    //Map click listener
    google.maps.event.addListener(map, 'click', function (event) {
        marker = new google.maps.Marker({position: event.latLng, map: map});
        setLocation(event.latLng);
    });
    // Try HTML5 geolocation
    /*
     if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
     var pos = new google.maps.LatLng(position.coords.latitude,
     position.coords.longitude);
     map.setCenter(pos);
     }, function() {
     handleNoGeolocation(true);
     });
     get_location();
     } else {
     window.alert("Browser doesn't support Geolocation");
     }
     */
}

function getData(){
  //  var webApiURL = "http://cors.io/?u=https://apps.dhis2.org/demo/api/organisationUnits?format=json";
    var webApiURL = "http://Play.dhis2.org/api/organisationUnits?format=json";
    $.getJSON(webApiURL, function(json) {
        //$('#results').append(json);
        console.log(json);
        //alert(json);
    });
}
