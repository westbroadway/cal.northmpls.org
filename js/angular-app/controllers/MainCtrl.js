'use strict';

calApp.controller('MainCtrl', function ($scope) {
  $scope.state = {
    loading: false
  };

  $scope.Events = [];

  $scope.Filters = {
    all: [],
    selected: []
  };

  //$scope.selectedFilters = [];

  var filterDisplayFormat = function (filter) {
    return filter.title;
  };

  $scope.FiltersSelect2Config = {
    multiple: true,
    id: 'name',
    data: {
      results: $scope.Filters.all,
      text: filterDisplayFormat
    },
    formatSelection: filterDisplayFormat,
    formatResult: filterDisplayFormat
  };

  $('#filters_select2').on('change', function (event) {
    var activeFilters = event.val;

    $scope.$broadcast(
      'events.updated',
      _($scope.Events).filter(function (item) {
        return _(activeFilters).contains(item.feedName);
      })
    );
  });

  $scope.gapiLoaded = function () {
    $scope.$emit('gapi.loaded');
  };
});