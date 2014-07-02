angular.module('AffineCuisine', ['ionic', 'AffineCuisine.services', 'AffineCuisine.controllers'])

/*.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})*/

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'main': {
                    templateUrl: 'templates/ingredients.html',
                    controller: 'HomeCtrl'
                }
            }
        })

    $urlRouterProvider.otherwise('/');
});
