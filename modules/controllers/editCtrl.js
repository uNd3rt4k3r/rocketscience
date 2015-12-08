
angular.module('rocketscienceApp')
    .controller('editCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', 'mapFactory', function ($scope,$http,$rootScope,$state, $stateParams, mapFactory) {
        console.log("editCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };


        mapFactory.currentCtrlScope = $scope;

    }]);
