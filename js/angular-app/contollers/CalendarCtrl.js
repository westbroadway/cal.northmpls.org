'use strict';

calApp.controller('CalendarCtrl', function ($scope, fullcalendarHelper) {

  var FEEDS_SOURCE = 'https://api.github.com/repos/westbroadway/northmpls_content/contents/calendar_feeds.yml';

  var obtainFeeds = function () {
    $.ajax({
      url: FEEDS_SOURCE,
      beforeSend: function (request) {
        request.setRequestHeader("Accept", "application/vnd.github.raw");
      },
      success: function (response) {
        // parse sources from yaml
        $scope.Sources.all = jsyaml.load(response.replace(/^\s+|\s+$/g, ''));

        $scope.Sources.active = jQuery.grep($scope.Sources.all, function (item) {
          //has a type of 'google_feed' and a value for 'url'
          return (item.type === 'google_feed' && item.url && item.url.length);
        });

        // filter out google_feeds and pass to full calendar
        initCalendar($scope.Sources.active);
      }
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