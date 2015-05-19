
angular.module('starter', ['ionic', 'starter.controllers'])

.config(function($ionicConfigProvider){
// iOS style is called large, android style is called small
  $ionicConfigProvider.form.toggle('large');
})

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
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/guard.html",
        controller: 'guardController'
      }

    }
  })

  .state('app.testSms', {
    url: "/sms",
    views: {
      'menuContent': {
        templateUrl: "templates/testsms.html",
        // controller: 'guardController'
      }

    }
  })


  .state('app.gas', {
    url: "/gas",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "templates/gas.html",
        controller: 'guardController'
      }
    }
  })

  .state('app.gas.pot', {
    url: "/pot/",
    cache: false,
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot1.html",
        controller: "gaspotController"
      }
    }
  })

  .state('app.gas.pots', {
    url: "/pots",
    cache: false,
    views: {
      'tabContent': {
        templateUrl: "templates/tabs/tab-pot.html",
        controller: 'gaspotsController'
      }
    }
  })



  .state('app.option', {
    url: "/option",
    abstract: true,
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/option.html"
      }
    }
  })

  .state('app.option.index', {
    url: "/index",
    cache: false,
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
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/ss.html",
        controller: "messagesController"
      }
    }
  })

  .state('app.option.nn', {
    url: "/nn",
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/nn.html",
        controller: "numbersController"
      }
    }
  })

  .state('app.option.nr', {
    url: "/nr",
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/nr.html",
        controller: "outputsController"
      }
    }
  })

  .state('app.option.vs', {
    url: "/vs",
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/vs.html",
        controller: "inputsController"
      }
    }
  })
  .state('app.option.nt', {
    url: "/nt",
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/nt.html",
       controller: "termoController"
      }
    }
  })

  .state('app.option.nd', {
    url: "/nd",
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/nd.html",
        controller: "accessController"
      }
    }
  })

  .state('app.option.add', {
    url: "/add",
    cache: false,
    views: {
      'optionContent': {
        templateUrl: "templates/options/add.html",
        controller: "addController"
      }
    }
  })

  .state('app.hand', {
    url: "/hand",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/hand.html",
        controller: "handController"
      }
    }
  })

  .state('app.objectEditor', {
    url: "/objectEditor",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/objectEditor.html",
        controller: "editorController"
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/guard');
});
