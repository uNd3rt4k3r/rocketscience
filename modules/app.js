'use strict';
angular.module('rocketscienceApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
]).config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: './views/skeleton.html',
        controller: 'MainCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});
