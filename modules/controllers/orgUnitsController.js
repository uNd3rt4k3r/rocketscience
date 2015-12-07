var urlBase = "";
var findMeCoords = {};
var orgDetails = {};
var searchOrgMarkers = {};

angular.module('rocketscienceApp')
    .controller('orgUnitsController', ['$scope', 'orgfactory', '$state', '$window', function ($scope, orgfactory, $state, $window) {

        $scope.orgLevels = {};
        $scope.orgGroups = {};

        // Fetching base url + organisation units on document ready
        getBaseUrl();

        var currentDetails;

        function getBaseUrl() {
            orgfactory.getBaseUrl().success(function (result) {
                urlBase = result.activities.dhis.href + "/api";
                populateSite();
            });
        }

        function populateSite() {
            orgfactory.getOrgUnits().success(function (result) {
                $scope.orgunits = result.organisationUnits;
                $scope.numberOfPages = new Array(result.pager.pageCount);
                $scope.activePage = 1;
                $scope.$broadcast('orgunitsloaded');
            }).error(function (error) {
                console.log('Unable to fetch organization units: ' + error);
            });

            orgfactory.getLevels().success(function (result) {
                $scope.orgLevels = result.organisationUnitLevels;
                $scope.$broadcast('orgLevelsAndGroupsLoaded');
            }).error(function (error) {
                console.log(error);
            });

            orgfactory.getGroups().success(function (result) {
                $scope.orgGroups = result.organisationUnitGroups;
                $scope.$broadcast('orgLevelsAndGroupsLoaded');
            }).error(function (error) {
                console.log(error);
            });
        }

        $scope.setInitState = function () {
            $state.go('home.search');
        }

        $scope.getOrgDetails = function getOrgDetails(id) {
            if (currentDetails != id) {
                currentDetails = id;
                orgfactory.getOrgDetails(id)
                    .success(function (result) {
                        $scope.orgdetails = result;
                        orgDetails = result;
                    })
                    .error(function (error) {
                        console.log('Unable to get organization unit details: ' + error);
                    });
            }
        };

        $scope.goToPage = function (page) {
            $scope.activePage = page;
            var params = getParams();
            orgfactory.getPageUnits(page, params).success(function (result) {
                $scope.orgunits = result.organisationUnits;
                $scope.$broadcast('orgunitsloaded');
                if (params.length == 1) {
                    timeToClearMap = true;
                }  else {
                    searchOrgMarkers = result.organisationUnits;
                }
            }).error(function (error) {
                console.log(error);
            });
        }

        $scope.editOrgDetails = function (currentDetails) {
            $state.go('home.edit', {
                unitCurrentDetails: currentDetails
            });
        }

        $scope.goToState = function (stateName) {
            switch (stateName) {
                case 'search':
                    timeToClearMap = true;
                    $state.go('home.search');
                    break;
                case 'add':
                    $state.go('home.add');
                    break;
            }
        }

        $scope.getSearchResult = function () {
            var params = getParams();
            orgfactory.getSearchResults(params).success(function (result) {
                $scope.orgunits = result.organisationUnits;
                $scope.numberOfPages = new Array(result.pager.pageCount);
                $scope.activePage = 1;
                $scope.$broadcast('orgunitsloaded');
                if (params.length == 1) {
                    timeToClearMap = true;
                } else {
                    searchOrgMarkers = result.organisationUnits;
                }
            }).error(function (error) {
                console.log(error);
            });
        }

        /*$scope.clearSearch = function () {
         console.log("clear search");
         $scope.searchPhrase = "";
         //$scope.selectedLevel = "";
         //$scope.selectedGroup = "";
         $scope.getSearchResult();
         }*/

        //Function to get location
        $scope.findGeoLocation = function () {
            $window.navigator.geolocation.getCurrentPosition(callback);
        }
        function callback(position) {
            findMeCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            newUnitCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        }

        function getParams() {
            var params = [];

            if ($scope.searchPhrase) {
                params.push('filter=name:like:' + $scope.searchPhrase);
            }

            if ($scope.selectedLevel) {
                params.push('filter=level:eq:' + $scope.selectedLevel);
            }

            if ($scope.selectedGroup) {
                params.push('filter=organisationUnitGroups.id:eq:' + $scope.selectedGroup);
            }
            params.push("fields=name,href,id,coordinates");

            return params;
        }
    }]);
