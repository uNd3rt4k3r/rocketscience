//TODO: REWRITE THIS SHIT
angular.module('rocketscienceApp')
    .factory('urlFactory', ['$http', function ($http) {

        var factoryHandler = {};

        factoryHandler.getBaseUrl = function () {
           return $http.get('manifest.webapp');

        };

        factoryHandler.getOrgUnits = function () {
            return $http.get(urlBase + "/organisationUnits.json");
        };

        factoryHandler.getOrgDetails = function (id) {
            return $http.get(urlBase + '/organisationUnits/' + id + '.json');
        };

        factoryHandler.getPageUnits = function (page, parameters) {
            return $http.get(urlBase + '/organisationUnits.json?page=' + page + "&" + createFilter(parameters));
        };

        factoryHandler.addOrgUnit = function (newOrgUnit) {
            return $http.post(urlBase + '/organisationUnits', newOrgUnit);
        };

        factoryHandler.editOrgUnit = function (id, editOrgUnit) {
            return $http.patch(urlBase + '/organisationUnits/' + id, editOrgUnit);
        };

        factoryHandler.getLevels = function () {
            return $http.get(urlBase + '/organisationUnitLevels.json?fields=name,level');
        };

        factoryHandler.getGroups = function () {
            return $http.get(urlBase + '/organisationUnitGroups.json');
        };

        factoryHandler.getSearchResults = function (parameters) {
            return $http.get(urlBase + '/organisationUnits.json?' + createFilter(parameters));
        };

        function createFilter(parameters) {
            var filter = "";
            for (var i = 0; i < parameters.length; i++) {
                filter += parameters[i];
                if (i !== (parameters.length - 1)) {
                    filter += "&";
                }
            }
            return filter;
        };

        return factoryHandler;
    }]);
