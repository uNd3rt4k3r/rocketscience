function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Well this is awkward, someone did screw up here");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(lat, lng);
    setLocation(myLatlng);
    draw_map(myLatlng);
}

/* UPDATES INPUTBOXES WITH POSITION DATA */
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
    var myLatlng = new google.maps.LatLng(3.61,-20.28);
    draw_map(myLatlng);

    for (data in getData()) {
        if (data.hasOwnProperty('coordinates')) {
            add_marker(data.coordinates);
        }
    }
    getOrgUnits();
}

function draw_map(myLatlng) {
    var mapOptions = {
        center: myLatlng,
        scrollwheel: false,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //var marker = new google.maps.Marker({
    //    position: myLatlng,
    //    map: map
    //});

    //setLocation(myLatlng);
    //Map click listener
    google.maps.event.addListener(map, 'click', function (event) {
        //marker = new google.maps.Marker({position: event.latLng, map: map});
        //setLocation(event.latLng);
    });

}

function add_marker(myLatlng){
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });
}

function getData() {
    var DHIS2Url = "https://play.dhis2.org/demo/api/organisationUnits";
    //$('#results').append("<h4>Results</h4>");

    var auth = btoa('admin:district');
    $.ajax({
        type: 'GET',
        headers: {"Authorization": "Basic " + auth},
        url: DHIS2Url,
        success: function (data) {
            console.log(data);
            return data;

        },
        error: function (xhr) {
            console.log(xhr)
        }
    });

}

function showData(data) {
    $('#results').append("<p>" + JSON.stringify(data, null, 2) + "</p>");
}


function editCordinates(data, lat, long) {
    var DHIS2Url = data.href;
    DHIS2Url += '/coordinates';
    data.coordinates = lat + "," + long;
    console.log(data);
    var auth = btoa('admin:district');

    $.ajax({
        url: DHIS2Url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + auth);
        },
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        processData: true,
        data: JSON.stringify(data),
        success: function (data) {
            console.log(data);
        },
        error: function () {
            console.log("Cannot put data");
        }
    });
}

function getOrgUnits() {
    //paging=false
    var DHIS2Url = "https://play.dhis2.org/demo/api/organisationUnits.json";
    var auth = btoa('admin:district');
    $.ajax({
        type: 'GET',
        headers: {"Authorization": "Basic " + auth},
        url: DHIS2Url,
        success: function (data) {
            showSearch(data);
        }, error: function (xhr) {
            console.log(xhr)
        }
    });
}

function showSearch(data) {
    var OrgUnitsJSON = data.organisationUnits;
    var searchString = "";
    for (var i = 0; i < OrgUnitsJSON.length; i++) {
        var orgUnit = OrgUnitsJSON[i];
        searchString += "<a href='" + orgUnit.href + "?format=json' class='link'>";
        searchString += orgUnit.name;
        searchString += "</a>";
        searchString += "<br>";
    }


    $('#searchresults').html(searchString);
}

function liveSearch(needle){
    var DHIS2Url = "https://play.dhis2.org/demo/api/organisationUnits.json?filter=name:like:"+needle;
    var auth = btoa('admin:district');
    $.ajax({
        type: 'GET',
        headers: {"Authorization": "Basic " + auth},
        url: DHIS2Url,
        success: function (data) {
            showSearch(data);
        }, error: function (xhr) {
            console.log(xhr)
        }
    });
}

function addNewUnit(){
    var name = $('#newUnitName').val();
    var DHIS2Url = "https://play.dhis2.org/demo/api/organisationUnits";

    var auth = btoa('admin:district');
    $.ajax({
        url: DHIS2Url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + auth);
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        processData: true,
        data: '{"name":"'+name+'"}',
        success: function (data) {
            console.log(data);
        },
        error: function () {
            console.log("Cannot put data");
        }
    });
}

