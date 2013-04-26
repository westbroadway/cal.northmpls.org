'use strict';

/**
 * A list of toggles that a click can turn on or off.
 * Examples to be posted shortly.
 * The filtering should work similar to this page http://mikesmithdev.com/examples/calendar.aspx

 * The filter should be the calendar 'title' property.
 * If we need a machine name use the 'name' property.
 * Some calendars share the same 'name' property and should be included as one.
 */
calApp.controller('CalendarCtrl', function ($scope, $http, fullcalendarHelper, GAPI) {

  var FEEDS_SOURCE = 'https://api.github.com/repos/westbroadway/northmpls_content/contents/calendar_feeds.yml';

  var calendarElm = $('#calendar');

  $scope.initCalendar = function (eventSources) {
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
      //eventSources: eventSources,
      events: eventSources,
      eventClick: function (event) {
        // opens events in a popup window
        window.open(event.url, 'gcalevent', 'width=700,height=600');
        return false;
      }
    });
  };

  $scope.updateCalendar = function (events) {
    fullcalendarHelper.removeEvents(calendarElm);
    fullcalendarHelper.addEventSource(calendarElm, events);
  };

  $scope.$on('events.updated', function (event, data) {
    $scope.updateCalendar(data);
  });

  var sources;
  (function () {
    $http.get(FEEDS_SOURCE, {headers: {"Accept": "application/vnd.github.raw"}})
      .success(function (response) {
        // parse sources from yaml
        sources = _.filter(
          jsyaml.load(response.replace(/^\s+|\s+$/g, '')),
          function (item) {
            //has a type of 'google_feed' and a value for 'url'
            return (item.type === 'google_feed' && item.url && item.url.length);
          });

        // init all available to fullcalendar filters
        angular.extend($scope.Filters.all, _(
          _(sources).map(function (item) {
            return { name: item.name, title: item.title, checked: true };
          })
        ).uniq(function (item) {
            return item.name;
          }));

        // populate all filters to selection
        $scope.Filters.selected = angular.copy($scope.Filters.all);

        $scope.$broadcast('sources.ready', sources);
      });
  }());

  var calsNum = 0;
  var calsObtained = 0;
  // fire up loading
  $scope.$on('gapi.ready', function () {
    var events = [];
    var obtainEvents = function (event, feeds) {
      _(feeds).each(function (feed) {
        if (!feed.google_cal_email) return; //@TODO
        calsNum += 1;
        gapi.client.calendar.events.list({
          calendarId: feed.google_cal_email.replace('%40', '@'),
          minTime: fullcalendarHelper.formatDate(new Date(Date.now() - 4010001000), 'u'),
          maxTime: fullcalendarHelper.formatDate(new Date(Date.now() + 4010001000), 'u'),
          singleEvents: true,
          maxResults: 200
        })
          .execute(function (response) {
            $scope.$apply(function () {
              events = events.concat(
                transformEvents(response.items, feed.name)
              );
              calsObtained += 1;
              if (calsNum === calsObtained) {
                angular.extend($scope.Events, events);
                $scope.initCalendar($scope.Events);
              }
            });
          });
      });
    };

    var transformEvents = function (gEvents, feedName) {
      if (!gEvents) return [];

      var events = [];
      _(gEvents).each(function (entry) {
        if (entry.status !== "confirmed") {
          return;
        }

        var startStr = entry.start.date || entry.start.dateTime;
        var start = fullcalendarHelper.parseISO8601(startStr, true);
        var endStr = entry.end.date || entry.end.dateTime;
        var end = fullcalendarHelper.parseISO8601(endStr, true);
        var allDay = startStr.indexOf('T') == -1;
        if (allDay) {
          fullcalendarHelper.addDays(end, -1);
        }
        var url = entry.htmlLink;
        events.push({
          id: entry.id,
          title: entry.summary,
          url: url,
          start: start,
          end: end,
          allDay: allDay,
          feedName: feedName,
          className: 'event-' + feedName
        });
      });
      return events;
    };

    if (!sources) {
      $scope.$on('sources.ready', obtainEvents);
    } else {
      obtainEvents(false, sources);
    }
  });

});
