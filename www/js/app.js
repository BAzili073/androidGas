// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })



  .state('app.guard', {
    url: "/guard",
    views: {
      'menuContent': {
        templateUrl: "templates/guard.html"
      }

    }
  })


  .state('app.gas', {
    url: "/gas",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "templates/gas.html"
      }
    }
  })

  .state('app.gas.pot', {
    url: "/pot",
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot.html"
        // controller: 'MainController'
      }
    }
  })

  .state('app.gas.pot1', {
    url: "/pot1",
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot1.html"
      }
    }
  })

  .state('app.gas.pot2', {
    url: "/pot2",
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot2.html"
      }
    }
  })

  .state('app.gas.pot3', {
    url: "/pot3",
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot3.html"
      }
    }
  })

  .state('app.option', {
    url: "/option",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "templates/option.html"
      }
    }
  })

  .state('app.option.index', {
    url: "/index",
    views: {
      'optionContent': {
        templateUrl: "templates/options/index.html"
      }
    }
  })

  .state('app.option.ns', {
    url: "/ns",
    views: {
      'optionContent': {
        templateUrl: "templates/options/ns.html"
      }
    }
  })

  .state('app.option.ss', {
    url: "/ss",
    views: {
      'optionContent': {
        templateUrl: "templates/options/ss.html"
      }
    }
  })

  .state('app.option.nn', {
    url: "/nn",
    views: {
      'optionContent': {
        templateUrl: "templates/options/nn.html"
      }
    }
  })

  .state('app.option.nr', {
    url: "/nr",
    views: {
      'optionContent': {
        templateUrl: "templates/options/nr.html"
      }
    }
  })
  .state('app.option.vs', {
    url: "/vs",
    views: {
      'optionContent': {
        templateUrl: "templates/options/vs.html"
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/guard');
});
