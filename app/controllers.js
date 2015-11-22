/**
 * Created by Kristian on 22.11.2015.
 */
rocketscienceControllers.controller('mainCtrl', ['$scope', '$http',
    function ($scope, $http) {
        //$http.get('phones/phones.json').success(function(data) {
        //    $scope.phones = data;
        //});
        alert("Hello");
        initialize_map();
    }]);