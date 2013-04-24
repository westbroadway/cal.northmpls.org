'use strict';

calApp.controller('MainCtrl', function ($scope) {
  $scope.state = {
    loading: false
  };

  $scope.Sources = {
    all: [],
    active: [],
    filtered: []
  };

  $scope.Filters = [];

  $scope.sourceChanged = function (filter, event) {
    if (event) event.preventDefault();

    if (filter.checked) {

    } else {

    }
  };
});