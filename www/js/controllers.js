var NUMBER = "+79021201364";
var COMMANDS = {
  RAPORT: "р",
  SET_PHONE: function(id, phone){ return 'нн ' + id + ' ' + phone;}
}
var READ_INTERVAL = 1000;

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $interval) {


  $scope.sms = {
    init: true,
    request: false,
    error: false
  };

  $scope.phones = {
    pot: NUMBER,
    master: "",
    ext1: "",
    ext2: "",
    ext3: "",
    ext4: ""
  };

  $scope.pot = {
    on: false,
    inputs: [0,0,0,0,0,0,0,0],
    outputs: [0,0],

    pot1: 8,
    pot2: 8,
    pot3: 8
  };
  $scope.lastSMS = '';

  $scope.setPotNumber = function(value){
    $scope.phones.pot = value;
  }

  $scope.updateNumber = function(id, phone){
    $scope.sms.request = true;

    SMS.sendSMS($scope.phones.pot, COMMANDS.SET_PHONE(id, phone), function(){
      $scope.sms.request = false;

      switch(id){
        case 0: $scope.phones.master = phone;break;
        case 1: $scope.phones.ext1 = phone;break;
        case 2: $scope.phones.ext2 = phone;break;
        case 3: $scope.phones.ext3 = phone;break;
        case 4: $scope.phones.ext4 = phone;break;
      }

    }, function() {
      $scope.sms.error = true;
    });

  }

  $scope.receiveSMS = function(sms){
      $scope.lastSMS = JSON.stringify(sms);
  }

  $scope.initSMS = function() {

    if(!$scope.sms.init) {
      SMS.sendSMS($scope.phones.pot, COMMANDS.RAPORT, function(){
        $scope.sms.request = true;
      }, function() {
        $scope.sms.error = true;
      });
    }


    $interval (function(){

      var filter = {
            box : 'inbox',
            read : 0,
            address : $scope.phones.pot,
        };

        if(SMS) SMS.listSMS(filter, function(data){
            if(Array.isArray(data)) {
                for(var i in data) {
                    if (data[i].address == $scope.phones.pot)
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

.controller('gasController', function($scope, $state) {

    $scope.potId = function() {
      return $state.params.potId;
    }

})

.controller('numbersController', function($scope, $timeout){
    $scope.phonesOptions = [
      { id: -1, label: 'Прибор'},
      { id: 0,  label: 'Хозяин'},
      { id: 1,  label: 'Дополнительный 1' },
      { id: 2,  label: 'Дополнительный 2' },
      { id: 3,  label: 'Дополнительный 3' },
      { id: 4,  label: 'Дополнительный 4' }
    ];

    $scope.selected = $scope.phonesOptions[1];

    $scope.resetForm = function() {
       switch($scope.selected.id){
         case -1: $scope.phoneNumber = $scope.phones.pot;break;
         case 0: $scope.phoneNumber = $scope.phones.master;break;
         case 1: $scope.phoneNumber = $scope.phones.ext1;break;
         case 2: $scope.phoneNumber = $scope.phones.ext2;break;
         case 3: $scope.phoneNumber = $scope.phones.ext3;break;
         case 4: $scope.phoneNumber = $scope.phones.ext4;break;
       }
    }

    $scope.setPhone = function(){
     if ($scope.selected.id < 0 )
      $scope.setPotNumber($scope.phoneNumber);
     else
      $scope.updateNumber($scope.selected.id, $scope.phoneNumber);
    }

    $scope.resetForm();
})
