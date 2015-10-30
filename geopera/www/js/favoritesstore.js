angular.module('jobs.favoritesstore', [])
	.factory('FavoritesStore', function() {

	  var favorites = angular.fromJson(window.localStorage['favorites'] || '[]');

	  function persist() {
	  	window.localStorage['favorites'] = angular.toJson(favorites);
	  }

	  return {

	    list: function() {
	      return favorites;
	    },

	    get: function(favoriteId) {
	      for (var i = 0; i < favorites.length; i++) {
	        if (favorites[i].id === favoriteId) {
	          return favorites[i];
	        }
	      }
	      return undefined;
	    },

	    create: function(favorite) {
	      favorites.push(note);
	      persist();
	    },

	    update: function(favorite) {
	      for (var i = 0; i < favorites.length; i++) {
	        if (favorites[i].id === favorite.id) {
	          favorites[i] = favorite;
	          persist();
	          return;
	        }
	      }
	    },

	    remove: function(favoriteId) {
	      for (var i = 0; i < favorites.length; i++) {
	        if (favorites[i].id === favoriteId) {
	          favorites.splice(i, 1);
	          persist();
	          return;
	        }
	      }
	    }

	  };

	});
