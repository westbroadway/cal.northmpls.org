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

  $scope.Filters = [];

  var calendarElm = $('#calendar');
  $scope.sourceChanged = function (filter, event) {
    if (event) event.preventDefault();

    var sources = _($scope.Sources.feeds).filter(function (item) {
      return item.name == filter.name;
    });
    if (filter.checked) {
      _(sources).each(function (source) {
        calendarElm.fullCalendar('addEventSource', source);
        calendarElm.fullCalendar('refetchEvents');
      });
    } else {
      _(sources).each(function (source) {
        calendarElm.fullCalendar('removeEventSource', source);
        calendarElm.fullCalendar('refetchEvents');
      });
    }
  };
});