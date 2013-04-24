APP.fullcalendar = (function ($) {

  var module = {
    FEEDS_SOURCE: 'https://api.github.com/repos/westbroadway/northmpls_content/contents/calendar_feeds.yml',

    // obtain feeds list
    obtainFeeds: function () {
      $.ajax({
        url: module.FEEDS_SOURCE,
        beforeSend: function (request) {
          request.setRequestHeader("Accept", "application/vnd.github.raw");
        },
        success: function (response) {
          // parse sources from yaml
          var sources = jsyaml.load(response.replace(/^\s+|\s+$/g, ''));
          // filter out google_feeds and pass to full calendar
          module.initCalendar(jQuery.grep(sources, function (item) {
            //has a type of 'google_feed' and a value for 'url'
            return (item.type === 'google_feed' && item.url && item.url.length);
          }));
        }
      });
    },

    initCalendar: function (eventSources) {
      $(module.idSelector).fullCalendar({
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
          if (bool) {
            $('#loading').show();
          } else {
            $('#loading').hide();
          }
        }
      });
    },

    init: function (idSelector) {
      module.idSelector = idSelector;
      module.obtainFeeds();
    }
  };

  return module;
}(jQuery));