'use strict';

calApp.service('GAPI', function ($rootScope) {

  $rootScope.$on('gapi.loaded', function () {
    gapi.client.setApiKey('AIzaSyASVdpUldNKyNK_Ky_ngaq3E1hm1SsSuHo');
    gapi.client.load('calendar', 'v3', function() {
      $rootScope.$broadcast('gapi.ready');
    });
  });

  var service = {

  };

  return service;

  //http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic
  //http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/full?
  //    alt=json-in-script
  //    &callback=jQuery19103457301771399962_1366916233195
  //    &start-min=2013-03-31T00%3A00%3A00Z
  //    &start-max=2013-05-12T00%3A00%3A00Z
  //    &singleevents=true
  //    &max-results=9999
  //    &_=1366916233196
  //http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/full?start-min=2013-03-31T00%3A00%3A00Z&start-max=2013-05-12T00%3A00%3A00Z&singleevents=true&max-results=9999
});
