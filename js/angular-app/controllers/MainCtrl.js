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

  var filterTmpl = _.template('<div class="event-<%= id %>"><%= text %></div>');

  var filterFormat = function (item) {
      return filterTmpl({id: item.name, text: item.name});
  }

  var filterDisplayFormat = function (filter) {
    return filter.title;
  };

  $scope.FiltersSelect2Config = {
    multiple: true,
    id: 'name',
    data: {
      results: $scope.Filters.all,
      text: filterFormat
    },
    formatSelection: filterDisplayFormat,
    formatResult: filterFormat
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

});