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
    var myLatlng = new google.maps.LatLng(3.61,15.28);
    draw_map(myLatlng);

    var allOrgUnits = getAllOrgUnit();
    console.log(allOrgUnits);
    /*var numbOrgUnits = 0;
    while (allOrgUnits[numbOrgUnits]) {
        numbOrgUnits++;
    }*/

    for (var index in allOrgUnits) {
        //.hasOwnProperty('coordinates')
        var orgUnit = getOrgUnit(allOrgUnits[index].href);

        if (orgUnit.hasOwnProperty('coordinates')) {
            if (orgUnit.coordinates != null && orgUnit.coordinates != "") {
                var coordinate = orgUnit.coordinates.replace("[","");
                coordinate = coordinate.replace("]","");
                console.log(coordinate);
                var coordinates = coordinate.split(",");
                var lat = coordinates[0];
                var lng = coordinates[1];
                var myLatLng = {lat: parseInt(lat), lng: parseInt(lng)};
                console.log(myLatLng);
                add_marker(myLatLng,orgUnit);
            }

        }

    }

    /*for (var i = 0; i < numbOrgUnits; i++) {
        if (allOrgUnits[i].hasOwnProperty('coordinates')) {
            add_marker(allOrgUnits[i].coordinates);
        }
    }*/
    getOrgUnits();
}

function getOrgUnit(href) {
    var DHIS2Url = href;
    //$('#results').append("<h4>Results</h4>");

    var auth = btoa('admin:district');
    var result;
    $.ajax({
        type: 'GET',
        headers: {"Authorization": "Basic " + auth},
        url: DHIS2Url,
        async: false, //TODO: Maybe remove
        success: function (data) {
            result = data;
        },
        error: function (xhr) {
            console.log(xhr)
        }
    });
    return result;
}

function draw_map(myLatlng) {
    var mapOptions = {
        center: myLatlng,
        scrollwheel: false,
        zoom: 2,
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

//var markers = [];
var curInfowindow = "";
function add_marker(myLatlng,orgUnit){
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: orgUnit.name
    });
    marker.setClickable(true);
    marker.setAnimation(google.maps.Animation.DROP);
    marker.setDraggable(true);

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading"><input type="text" id="txt'+orgUnit.id+'" value="'+orgUnit.name+'"/></h1>'+
        '<div id="bodyContent">'+
        '<p><b></b>' +
        //'About text?</p>'+
        '<p><a href="'+orgUnit.href+'">'+
        orgUnit.href +'</a> '+
        'ID: ' + orgUnit.id + '.</p>'+
        '</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker, 'click', function (event) {
        console.log(curInfowindow);
        if (curInfowindow != "") {
            curInfowindow.close();
        }

        if (curInfowindow == infowindow) {
            infowindow.close();
            curInfowindow = "";
        }
        else {
            infowindow.open(map, marker);
            curInfowindow = infowindow;
            map.setZoom(6);

            var inputBox = document.getElementById('txt'+orgUnit.id);
            inputBox.addEventListener("input", function() {
                editName(orgUnit, inputBox.value);
            });

        }



    });

    google.maps.event.addListener(marker,'drag',function(event) {
        //console.log("Draging: "+ orgUnit.name);
        //console.log(event.latLng.lat());
        //console.log(event.latLng.lng());
    });

    google.maps.event.addListener(marker,'dragend',function(event) {
        //console.log("Drag stop");
        editCordinates(orgUnit,event.latLng.lat(), event.latLng.lng());
        console.log("New coordinates saved");
        marker.setClickable(true);
    });


    //markers.push(marker);
}

function getAllOrgUnit() {
    var DHIS2Url = "https://play.dhis2.org/demo/api/organisationUnits";
    //$('#results').append("<h4>Results</h4>");

    var auth = btoa('admin:district');
    var result;
    $.ajax({
        type: 'GET',
        headers: {"Authorization": "Basic " + auth},
        url: DHIS2Url,
        async: false, //TODO: Maybe remove
        success: function (data) {
            console.log(data.organisationUnits);
            console.log(data);
            result = data.organisationUnits;

        },
        error: function (xhr) {
            console.log(xhr)
        }
    });

    return result;

}

function showData(data) {
    $('#results').append("<p>" + JSON.stringify(data, null, 2) + "</p>");
}

function editName(orgUnit, newName) {
    orgUnit.name = newName;
    saveOrgUnit(orgUnit, orgUnit.href)
}

function editCordinates(data, lat, long) {
    var DHIS2Url = data.href;
    DHIS2Url += '/coordinates';
    data.coordinates = lat + "," + long;
    console.log(data);
    saveOrgUnit(data,DHIS2Url);
}

function saveOrgUnit(orgUnit, href) {
    var auth = btoa('admin:district');

    $.ajax({
        url: href,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + auth);
        },
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        processData: true,
        data: JSON.stringify(orgUnit),
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

