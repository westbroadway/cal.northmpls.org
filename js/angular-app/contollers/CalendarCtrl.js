'use strict';

/**
 * A list of toggles that a click can turn on or off.
 * Examples to be posted shortly.
 * The filtering should work similar to this page http://mikesmithdev.com/examples/calendar.aspx

 * The filter should be the calendar 'title' property.
 * If we need a machine name use the 'name' property.
 * Some calendars share the same name property and should be included as one.
 */
calApp.controller('CalendarCtrl', function ($scope, $http, fullcalendarHelper) {

  var FEEDS_SOURCE = 'https://api.github.com/repos/westbroadway/northmpls_content/contents/calendar_feeds.yml';

  var obtainFeeds = function () {
    $http.get(FEEDS_SOURCE, {headers: {"Accept": "application/vnd.github.raw"}})
      .success(function (response) {
        // parse sources from yaml
        angular.extend($scope.Sources.all, _.filter(
          jsyaml.load(response.replace(/^\s+|\s+$/g, '')),
          function (item) {
            //has a type of 'google_feed' and a value for 'url'
            return (item.type === 'google_feed' && item.url && item.url.length);
          }));

        $scope.Sources.feeds = angular.copy($scope.Sources.all);

        $scope.Filters = angular.extend($scope.Filters, _(
          _($scope.Sources.feeds).map(function (item) {
            return { name: item.name, title: item.title, checked: true };
          })
        ).uniq(function (item) {
            return item.name;
          }));

        // filter out google_feeds and pass to full calendar
        initCalendar($scope.Sources.feeds);
      });
  };

  var calendarElm = $('#calendar');

  var initCalendar = function (eventSources) {
    fullcalendarHelper.init(calendarElm, {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      columnFormat: {
        month: 'dddd',    // Monday
        week: 'ddd M/d', // Mon 9/7
        day: 'dddd M/d'  // Monday 9/7
      },
      eventSources: eventSources,
      eventClick: function (event) {
        // opens events in a popup window
        window.open(event.url, 'gcalevent', 'width=700,height=600');
        return false;
      },
      loading: function (bool) {
        $scope.state.loading = bool;
      }
    });
  };

  // fire up loading
  obtainFeeds();

})