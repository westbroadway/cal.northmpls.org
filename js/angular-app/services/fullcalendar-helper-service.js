'use strict';

calApp.service('fullcalendarHelper', function () {

    var service = {

      init: function (elm, options) {
        //call fullCalendar from an empty html tag, to keep angular happy.
        elm.html('').fullCalendar(options);
      },

      render: function (elm) {
        elm.fullCalendar('render');
      },

      reset: function (elm) {
        service.removeEvents(elm);
        service.refetchEvents(elm);
      },

      removeEvents: function (elm) {
        elm.fullCalendar('removeEvents');
      },

      refetchEvents: function (elm) {
        elm.fullCalendar('refetchEvents');
      },

      triggerNext: function (elm) {
        elm.fullCalendar('next');
      },

      triggerPrev: function (elm) {
        elm.fullCalendar('prev');
      },

      clientEvents: function (elm) {
        return elm.fullCalendar('clientEvents');
      }
    };

    return service;
  });