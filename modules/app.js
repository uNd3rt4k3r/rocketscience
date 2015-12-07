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
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../views/home.html',
            controller: 'mainCtrl'
        })
        .state('home.search', {
            url: 'search',
            views: {
                'action': {
                    templateUrl: '../views/search.html',
                    controller: 'searchCtrl'
                }
            }
        })
        .state('home.add', {
            url: 'add',
            views: {
                'action': {
                    templateUrl: '../views/add.html',
                    controller: 'addCtrl'
                }
            }
        })
        .state('home.edit', {
            url: 'edit',
            views: {
                'action': {
                    templateUrl: '../views/edit.html',
                    controller: 'editCtrl'
                }
            }
        });
});
