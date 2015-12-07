angular.module('rocketscienceApp')
    .factory('orgUnitsFactory', ['$http', function ($http) {

        var orgfactory = {};

        orgfactory.getBaseUrl = function () {
            return $http.get('manifest.webapp');
        }

        orgfactory.getOrgUnits = function () {
            return $http.get(urlBase + "/organisationUnits.json");
        }

        orgfactory.getOrgDetails = function (id) {
            return $http.get(urlBase + '/organisationUnits/' + id + '.json');
        }

        orgfactory.getPageUnits = function (page, parameters) {
            return $http.get(urlBase + '/organisationUnits.json?page=' + page + "&" + createFilter(parameters));
        }

        orgfactory.addOrgUnit = function (newOrgUnit) {
            return $http.post(urlBase + '/organisationUnits', newOrgUnit);
        }

        orgfactory.editOrgUnit = function (id, editOrgUnit) {
            return $http.patch(urlBase + '/organisationUnits/' + id, editOrgUnit);
        }

        orgfactory.getLevels = function () {
            return $http.get(urlBase + '/organisationUnitLevels.json?fields=name,level');
        }

        orgfactory.getGroups = function () {
            return $http.get(urlBase + '/organisationUnitGroups.json');
        }

        orgfactory.getSearchResults = function (parameters) {
            return $http.get(urlBase + '/organisationUnits.json?' + createFilter(parameters));
        }

        function createFilter(parameters) {
            var filter = "";
            for (var i = 0; i < parameters.length; i++) {
                filter += parameters[i];
                if (i !== (parameters.length - 1)) {
                    filter += "&";
                }
            }
            return filter;
        }

        return orgfactory;
    }]);
