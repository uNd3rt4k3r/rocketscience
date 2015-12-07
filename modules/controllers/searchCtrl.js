
angular.module('rocketscienceApp')
    .controller('searchCtrl', ['$scope', '$http','$rootScope','$state', '$stateParams', 'urlFactory', function ($scope,$http,$rootScope,$state, $stateParams, urlFactory) {
        console.log("searchCtrl started");

        $scope.isActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function(route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

        $scope.viewAllOrgUnits = function() {
            console.log(3);
            urlFactory.getAllOrgUnits().then( function (response) {
                var allOrgUnits = response.data;
                console.log(allOrgUnits);
            });
        }

        if (baseURL !== "") {
            $scope.viewAllOrgUnits();
        } else {
            urlFactory.getManifest().then(function (response) {
                baseURL = response.data.activities.dhis.href + "/api";
                $scope.viewAllOrgUnits();
            });
        }

    }]);
