//Angular App Module and Controller

var markers = [];
var map;
angular.module('rocketscienceApp')
    .controller('mapCtrl', function ($scope) {
        console.log("mapCtrl started");


        /*$scope.markers = [];

         var infoWindow = new google.maps.InfoWindow();

         var createMarker = function (info){

         var marker = new google.maps.Marker({
         map: $scope.map,
         position: new google.maps.LatLng(info.lat, info.long),
         title: info.city
         });
         marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

         google.maps.event.addListener(marker, 'click', function(){
         infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
         infoWindow.open($scope.map, marker);
         });

         $scope.markers.push(marker);

         }

         for (i = 0; i < cities.length; i++){
         createMarker(cities[i]);
         }

         $scope.openInfoWindow = function(e, selectedMarker){
         e.preventDefault();
         google.maps.event.trigger(selectedMarker, 'click');
         }
         */
    });