(function() {

var app = angular.module('myreddit', ['ionic', 'angularMoment']);

app.controller('RedditCtrl', function($http, $scope) {

  $scope.stories = [];

  function loadStories(params, callback) {
    
    $http.get('http://api.geopera.com/jobs?code=PT&query=*', {params: params})
      .success(function(response) {
        var stories = [];
        angular.forEach(response.jobs, function(job) {
          if (!job.thumbnail || job.thumbnail === 'self' || job.thumbnail === 'default') {
            job.thumbnail = 'https://www.redditstatic.com/icon.png';
          }
          job.id = job.link;
          stories.push(job);
        });
        callback(stories);
      });
  }

  var page = 0;
  $scope.loadOlderStories = function() {
    var params = {};
    if ($scope.stories.length > 0) {
      params['page'] = page++;
    }
    loadStories(params, function(olderStories) {
      $scope.stories = $scope.stories.concat(olderStories);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  
  /*$scope.loadNewerStories = function() {
    var params = {'before': $scope.stories[0].name};
    loadStories(params, function(newerStories) {
      $scope.stories = newerStories.concat($scope.stories);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };*/

  $scope.openLink = function(url) {
    window.open(url, '_blank');
  };

});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());