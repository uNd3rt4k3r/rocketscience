'use strict';
angular.module('rocketscienceApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
]).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/search");
    $stateProvider.state('main', {
            url: '/index',
            templateUrl: './views/skeleton.html',
            controller: 'mainCtrl'
        });
});
