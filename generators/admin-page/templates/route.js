'use strict';

angular.module('<%= app_name %>')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.<%= model %>', {
        url: '/<%= model %>',
        templateUrl: 'app/admin/<%= model %>/<%= model %>.html',
        controller: 'Admin<%= Model %>Ctrl',
        authenticate : true
      });
  });