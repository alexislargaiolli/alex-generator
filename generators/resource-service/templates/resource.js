'use strict';

angular.module('<%= app_name %>')
  .factory('<%= Model %>', function ($resource) {    

    var <%= Model %> = $resource('<%= apiUrl %>/:id', {id:'@_id'}, {
        'update': { method:'PUT' },
        'paginate': {method:'GET', url: '<%= apiUrl %>/paginate'}
    });

    // Public API here
    return <%= Model %>;
  });
