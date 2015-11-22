/**
 * Created by Kristian on 22.11.2015.
 */

angular.module('rocketscienceApp')
    .controller('MainCtrl', ['$scope', '$location', '$route', function ($scope, $location, $route) {
        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        }

        $scope.foo = "faa";

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        }

        alert("Hello");
        //initialize_map();

        //$http.get('phones/phones.json').success(function(data) {
        //    $scope.phones = data;
        //});
    }]);
