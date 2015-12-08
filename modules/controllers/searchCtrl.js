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

        $scope.doSearch = function () {
            console.log("Searching...");
            console.log($scope.searchInput);
            console.log($scope.selectedBorder);
            console.log($scope.selectedGroup);
            var filter = "";

            //TODO: SEARCH
            //'name:like:' + $scope.searchInput;}


            //organisationUnitGroups.id:eq:' + $scope.selectedGroup
            //level:eq: + $scope.selectedGroup
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
                //console.log($scope.organisationUnits);
                //console.log($scope.pages);
            }, function (error) {
                console.log(error);
            });

            mapFactory.showAllOrgUnits();
        };

        $scope.setPage = function (page) {
            urlFactory.getOrgUnitOnPageNumberWithParameters(page, "").then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pageSelected = page;
            }, function (error) {
                console.log(error);
            });

        }

        $scope.doSearch = function(){
            urlFactory.getOrgUnitWithParameters(getParams()).then(function (response) {
                $scope.organisationUnits = response.data.organisationUnits;
                $scope.pages = response.data.pager.pageCount;
                $scope.pageSelected = 1;
            }, function (error) {
                console.log(error);
            });
        }

        function getParams() {
            var params = [];

            if ($scope.searchInput) {
                params.push('filter=name:like:' + $scope.searchInput);
            }

            if ($scope.selectedBorder) {
                params.push('filter=level:eq:' + $scope.selectedBorder);
            }

            if ($scope.selectedGroup) {
                params.push('filter=organisationUnitGroups.id:eq:' + $scope.selectedGroup);
            }
            params.push("fields=name,href,id,coordinates");

            return params;
        }
        //this is when the controller is destroyed/closed/left behind
        $scope.$on("$destroy", function () {
            console.log("?");
            mapFactory.clearAllMarkers();
            console.log("??");
        });

        if (baseURL !== "") {
            $scope.initSearchCtrl()
        } else {
            urlFactory.getManifest().then(function (response) {
                baseURL = response.data.activities.dhis.href + "/api";
                $scope.initSearchCtrl()
            });
        };

    }]);
