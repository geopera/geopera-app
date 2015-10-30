(function () {

    var app = angular.module('myreddit', ['ionic', 'angularMoment', 'jobs.favoritesstore']);

    app.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        });

        $stateProvider.state('favorites', {
            url: '/favorites',
            templateUrl: 'templates/favorites.html'
        });

        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'templates/settings.html'
        });

        $urlRouterProvider.otherwise('/home');

    });
    
    
    app.controller('FavoritesCtrl', function ($http, $scope, FavoritesStore) {
          $scope.favorites = FavoritesStore.list();
          
            $scope.remove = function(noteId) {
                FavoritesStore.remove(noteId);
            };

    });
    
    
    app.controller('JobsCtrl', function ($http, $scope, FavoritesStore) {

        var config = angular.fromJson(window.localStorage['config'] || '{"code" : "PT", "query" : "*", "page": 0}');

        $scope.stories = [];
        $scope.searchText = config.query;
        $scope.searchCountryCode = config.code;

        function persistConfig() {
            window.localStorage['config'] = angular.toJson(config);
        }

        function loadStories(callback) {

            $http.get('mock/jobs.json', {
                    //$http.get('http://api.geopera.com/jobs', {
                    params: config
                })
                .success(function (response) {
                    var stories = [];
                    angular.forEach(response.jobs, function (job) {
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
        
        $scope.getFavoriteIcon = function(favorite){
            if(FavoritesStore.get(favorite.id)){
                return 'ion-android-favorite';
            }else {
                return 'ion-android-favorite-outline';
            }
        }
        
        $scope.loadOlderStories = function () {
            if ($scope.stories.length > 0) {
                config['page'] = page++;
            }
            loadStories(function (olderStories) {
                $scope.stories = $scope.stories.concat(olderStories);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        
       $scope.addToFavorites = function (favorite){
                       if(FavoritesStore.get(favorite.id)){
           FavoritesStore.remove(favorite.id);

                       } else {
                                      FavoritesStore.create(favorite);

                       }
       }


        $scope.openLink = function (url) {
            window.open(url, '_blank');
        };


        $scope.doSearch = function () {

            config.query = $scope.searchText;
            config.code = $scope.searchCountryCode;

            persistConfig();

            $scope.stories = [];

            loadStories(function (stories) {
                $scope.stories = $scope.stories.concat(stories);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });

        };

    });


    app.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.cordova && window.cordova.InAppBrowser) {
                window.open = window.cordova.InAppBrowser.open;
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

}());