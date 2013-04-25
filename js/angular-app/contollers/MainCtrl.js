'use strict';

calApp.controller('MainCtrl', function ($scope) {
  $scope.state = {
    loading: false
  };

  $scope.Sources = {
    all: [],
    feeds: [],
    filtered: []
  };

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
    formatResult: filterDisplayFormat,
    change: function (event) {
      console.log(arguments);
    }
  };

  var calendarElm = $('#calendar');

  $('#filters_select2').on('change', function (event) {
    var findSourcesByName = function (name) {
      return _($scope.Filters.all).filter(function (item) {
        return item.name == name;
      });
    };

    if (event.added) {
      _(findSourcesByName(event.added.name)).each(function (source) {
        calendarElm.fullCalendar('addEventSource', source);
        calendarElm.fullCalendar('refetchEvents');
      });
    } else if (event.removed) {
      _(findSourcesByName(event.removed.name)).each(function (source) {
        calendarElm.fullCalendar('removeEventSource', source);
        calendarElm.fullCalendar('refetchEvents');
      });
    }
  });

  $scope.gapiLoaded = function () {
    $scope.$emit('gapi.loaded');
  };
});