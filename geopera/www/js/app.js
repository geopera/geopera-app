(function() {

var app = angular.module('myreddit', ['ionic', 'angularMoment']);

app.controller('RedditCtrl', function($http, $scope) {

  $scope.stories = [];
  $scope.searchText = "";
  $scope.searchCountryCode = "PT";
  
  function loadStories(params, callback) {
    
    if (params.query == undefined || params.query == ""){
      params.query = "*";
    }
    
    if(params.code == undefined || params.code == ""){
      params.code = $scope.searchCountryCode;
    }
    
    $http.get('http://api.geopera.com/jobs', {params: params})
      .success(function(response) {
        var stories = [];
        angular.forEach(response.jobs, function(job) {
          if (!job.thumbnail || job.thumbnail === 'self' || job.thumbnail === 'default') {
            job.thumbnail = 'http://a5.mzstatic.com/us/r30/Purple3/v4/fa/fe/fe/fafefe3d-9415-8c9c-2f76-5161d91d6dd1/icon175x175.png';
          }
          job.id = job.link;
          job.date = new Date(job.insertDate);
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
  
  $scope.doSearch = function() {
    
    var params = {};
    params.query = $scope.searchText;
    params.code = $scope.searchCountryCode;

    $scope.stories = [];
      
    loadStories(params, function(stories) {
      $scope.stories = $scope.stories.concat(stories);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });

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