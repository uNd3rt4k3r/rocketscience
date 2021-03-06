angular.module('rocketscienceApp')
    .factory('urlFactory', ['$http', function ($http) {
        console.log("urlFactory init");

        var factoryHandler = {};
        var pageSize = "pageSize=12";
        factoryHandler.getManifest = function () {
           return $http.get('manifest.webapp');
        };

        factoryHandler.getAllOrgUnits = function () {
            return $http.get(baseURL + "/organisationUnits.json?"+pageSize);
        };

        factoryHandler.getOrgUnitById = function (id) {
            return $http.get(baseURL + '/organisationUnits/' + id + '.json');
        };

        factoryHandler.getOrgUnitOnPageNumber = function (page) {
            return $http.get(baseURL + '/organisationUnits.json?page=' + page + "&"+ pageSize);
        };

        factoryHandler.getOrgUnitOnPageNumberWithParameters = function (page, parameters) {
            return $http.get(baseURL + '/organisationUnits.json?page=' + page + "&" + paramToString(parameters) + "&" +pageSize);
        };

        factoryHandler.addOrgUnit = function (newOrgUnit) {
            return $http.post(baseURL + '/organisationUnits', newOrgUnit);
        };

        factoryHandler.editOrgUnit = function (id, editedOrgUnit) {
            return $http.put(baseURL + '/organisationUnits/' + id, editedOrgUnit);
        };

        factoryHandler.deleteOrgUnit = function (id) {
            return $http.delete(baseURL + '/organisationUnits/' + id);
        };
        factoryHandler.getLevels = function () {
            return $http.get(baseURL + '/organisationUnitLevels.json?fields=name,level');
        };

        factoryHandler.getGroups = function () {
            return $http.get(baseURL + '/organisationUnitGroups.json');
        };

        factoryHandler.getAllForGivenLevel = function (level) {
            return $http.get(baseURL + '/organisationUnits.json?fields=name,id&paging=false&level=' + level);
        };

        factoryHandler.getOrgUnitWithParameters = function (parameters) {
            return $http.get(baseURL + '/organisationUnits.json?' + paramToString(parameters) + "&"+ pageSize);
        };

        function paramToString(parameters) {
            var stringParam = "";
            for (var i = 0; i < parameters.length; i++) {
                stringParam += parameters[i];
                if (i !== (parameters.length - 1)) {
                    stringParam += "&";
                }
            }
            return stringParam;
        };

        return factoryHandler;
    }]);
