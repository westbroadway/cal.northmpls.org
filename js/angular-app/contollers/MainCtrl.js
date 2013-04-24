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
});