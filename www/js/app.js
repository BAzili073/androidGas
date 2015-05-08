
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
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
        templateUrl: "templates/gas.html",
        controller: "gasController"
      }
    }
  })

  .state('app.gas.pots', {
    url: "/pots",
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot.html"
        // controller: 'MainController'
      }
    }
  })

  .state('app.gas.pot', {
    url: "/pots/:potId",
    cache: false,
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot1.html"
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
        templateUrl: "templates/options/ns.html",
        controller: "saturnOptionsController"
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
        templateUrl: "templates/options/nn.html",
        controller: "numbersController"
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
