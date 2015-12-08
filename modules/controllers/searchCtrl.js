angular.module('rocketscienceApp')
    .controller('searchCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams', 'urlFactory', 'mapFactory', function ($scope, $http, $rootScope, $state, $stateParams, urlFactory, mapFactory) {
        console.log("searchCtrl started");

        $scope.searchParam = [];
        $scope.searchParam.organisationUnitGroups;
        $scope.searchParam.organisationUnitBorder;

        $scope.curSearchParam = [];
        $scope.curSearchParam.organisationUnitGroups;
        $scope.curSearchParam.organisationUnitBorder;


        $scope.isActive = function (route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return route === $location.path();
        };

        $scope.isNotActive = function (route) {
            //console.log("parm:" + route + " location: " + $location.path());
            return (route !== $location.path());
        };

        $scope.initSearchCtrl = function () {
            urlFactory.getLevels().then(function (response) {
                console.log(response);
                $scope.searchParam.organisationUnitBorder = response.data.organisationUnitLevels;
                //console.log($scope.organisationUnitBorder);
            }, function (error) {
                console.log(error);
            });

            urlFactory.getGroups().then(function (response) {
                console.log(response);
                $scope.searchParam.organisationUnitGroups = response.data.organisationUnitGroups;
                //console.log($scope.organisationUnitGroups);
            }, function (error) {
                console.log(error);
            });

            urlFactory.getAllOrgUnits().then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pages = response.data.pager.pageCount;
                $scope.pageSelected = 1;
                mapFactory.showOrgUnitsOnMap($scope.organisationUnits);
                //console.log($scope.organisationUnits);
                //console.log($scope.pages);
            }, function (error) {
                console.log(error);
            });

            //mapFactory.showAllOrgUnits();
        };

        $scope.setPage = function (page) {
            urlFactory.getOrgUnitOnPageNumberWithParameters(page, getParams()).then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pageSelected = page;
                mapFactory.showOrgUnitsOnMap($scope.organisationUnits);
            }, function (error) {
                console.log(error);
            });

        };

        $scope.doSearch = function () {
            urlFactory.getOrgUnitWithParameters(getParams()).then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pages = response.data.pager.pageCount;
                $scope.pageSelected = 1;
                mapFactory.showOrgUnitsOnMap($scope.organisationUnits);
            }, function (error) {
                console.log(error);
            });
        };

        $scope.editOrgUnit = function (orgUnitId) {
            console.log(orgUnitId);
            $state.go('home.edit', {
                unitId:orgUnitId
            });
        }

        function getParams() {
            var parameters = [];

            if ($scope.selectedBorder) {
                parameters.push('filter=level:eq:' + $scope.selectedBorder);
            }
            if ($scope.selectedGroup) {
                parameters.push('filter=organisationUnitGroups.id:eq:' + $scope.selectedGroup);
            }
            if ($scope.searchInput) {
                parameters.push('filter=name:like:' + $scope.searchInput);
            }

            parameters.push("fields=name,href,id,coordinates");

            return parameters;
        }

        //this is when the controller is destroyed/closed/left behind
        $scope.$on("$destroy", function () {
            mapFactory.clearAllMarkers();
        });

        if (baseURL !== "") {
            $scope.initSearchCtrl()
        } else {
            urlFactory.getManifest().then(function (response) {
                baseURL = response.data.activities.dhis.href + "/api";
                $scope.initSearchCtrl()
            });
        }
        ;

        mapFactory.currentCtrlScope = $scope;

    }]);
