var NUMBER = "+79021201364";
var COMMANDS = {
  RAPORT: "р"
}
var READ_INTERVAL = 1000;

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $interval) {

  $scope.sms = {
    init: true,
    request: false,
    error: false
  };

  $scope.potNumber = NUMBER;

  $scope.pot = {
    on: false,
    inputs: [0,0,0,0,0,0,0,0],
    outputs: [0,0],

    pot1: 8,
    pot2: 8,
    pot3: 8
  };
  $scope.lastSMS = '';

  $scope.receiveSMS = function(sms){
      $scope.lastSMS = JSON.stringify(sms);
  }


  $scope.initSMS = function() {

    if(!$scope.sms.init) {
      SMS.sendSMS($scope.potNumber, COMMANDS.RAPORT, function(){
        $scope.sms.request = true;
      }, function() {
        $scope.sms.error = true;
      });
    }

    $interval (function(){

      var filter = {
            box : 'inbox',
            read : 0,
            address : $scope.potNumber,
        };

        if(SMS) SMS.listSMS(filter, function(data){
            if(Array.isArray(data)) {
                for(var i in data) {
                    if (data[i].address == $scope.potNumber)
                    $scope.receiveSMS(data[i]);
                }
            }
        }, function(err){
            updateStatus('error list sms: ' + err);
        });

    },READ_INTERVAL
    )
  };

  document.addEventListener('deviceready', $scope.initSMS, false);

})

.controller('GreetingController', function($scope) {
  $scope.greeting = 'Hola!';
});
