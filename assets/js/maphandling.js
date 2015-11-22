/**
 * Created by Kristian on 21.11.2015.
 */

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



//var url = "http://192.168.0.196:8082/api/organisationUnits?format=json";
function getData(){
    /*var webApiURL = "http://localhost:8082/api/organisationUnits?format=json";
     var webApiURL = url;
     $.getJSON(webApiURL, function(json) {
     //$('#results').append(json);
     console.log(json);
     //alert(json);
     });
     console.log("boya");*/
    var auth = btoa('admin:district');
    $.ajax({
        type: 'GET',
        headers: {"Authorization": "Basic "+auth},
        //params: { j_username: "admin", j_password: "district" },
        url: 'http://localhost:8082/api/organisationUnits?format=json',
        success   : function(data) { console.log(data);},
        error: function(xhr) {console.log(xhr)}
    });
}

//$(document).ready(function() {
//    initialize_map();
//    alert("hello");
//});