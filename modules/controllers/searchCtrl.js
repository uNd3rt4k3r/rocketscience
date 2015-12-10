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
            if ($stateParams.unitName) {
                $scope.searchInput = $stateParams.unitName;

            }

            urlFactory.getLevels().then(function (response) {
                $scope.searchParam.organisationUnitBorder = response.data.organisationUnitLevels;
                //console.log($scope.organisationUnitBorder);
                $scope.doSearch();
            }, function (error) {
                console.log(error.data);
            });

            urlFactory.getGroups().then(function (response) {
                $scope.searchParam.organisationUnitGroups = response.data.organisationUnitGroups;
                //console.log($scope.organisationUnitGroups);
                $scope.doSearch();
            }, function (error) {
                console.log(error.data);
            });

            urlFactory.getAllOrgUnits().then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pages = response.data.pager.pageCount;
                $scope.pageSelected = 1;
                mapFactory.showOrgUnitsOnMap($scope.organisationUnits);
                $scope.doSearch();
                //console.log($scope.organisationUnits);
                //console.log($scope.pages);
            }, function (error) {
                console.log(error.data);
            });


            //mapFactory.showAllOrgUnits();
        };

        $scope.setPage = function (page) {
            urlFactory.getOrgUnitOnPageNumberWithParameters(page, getParameters()).then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pageSelected = page;
                mapFactory.showOrgUnitsOnMap($scope.organisationUnits);
            }, function (error) {
                console.log(error.data);
            });
        };

        $scope.whatClassIsIt= function(index){
            if(index == $scope.pageSelected){
                return "active";
            }
            if((index - $scope.pageSelected) >= 10 || $scope.pageSelected > index){
                return "notVisible";
            }
        }

        $scope.doSearch = function () {
            urlFactory.getOrgUnitWithParameters(getParameters()).then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pages = response.data.pager.pageCount;
                $scope.pageSelected = 1;
                mapFactory.showOrgUnitsOnMap($scope.organisationUnits);
            }, function (error) {
                console.log(error.data);
            });
        };

        $scope.editOrgUnit = function (orgUnitId) {
            $state.go('home.edit', {
                unitId:orgUnitId
            });
        };

        function getParameters() {
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
        };

        mapFactory.currentCtrlScope = $scope;

        mapFactory.setSearchControllerActive(true);


    }]);
