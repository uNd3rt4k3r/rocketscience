//TODO: REWRITE THIS SHIT
angular.module('rocketscienceApp')
    .factory('urlFactory', ['$http', function ($http) {

        var factoryHandler = {};

        factoryHandler.getManifest = function () {
           return $http.get('manifest.webapp');

        };

        factoryHandler.getAllOrgUnits = function () {
            return $http.get(baseURL + "/organisationUnits.json");
        };

        factoryHandler.getOrgUnitById = function (id) {
            return $http.get(baseURL + '/organisationUnits/' + id + '.json');
        };

        factoryHandler.getUnitOnPageNUmber = function (page, parameters) {
            return $http.get(baseURL + '/organisationUnits.json?page=' + page + "&" + createFilter(parameters));
        };

        factoryHandler.addOrgUnit = function (newOrgUnit) {
            return $http.post(baseURL + '/organisationUnits', newOrgUnit);
        };

        factoryHandler.editOrgUnit = function (id, editOrgUnit) {
            return $http.patch(baseURL + '/organisationUnits/' + id, editOrgUnit);
        };

        factoryHandler.getLevels = function () {
            return $http.get(baseURL + '/organisationUnitLevels.json?fields=name,level');
        };

        factoryHandler.getGroups = function () {
            return $http.get(baseURL + '/organisationUnitGroups.json');
        };

        factoryHandler.getSearchResults = function (parameters) {
            return $http.get(baseURL + '/organisationUnits.json?' + createFilter(parameters));
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
