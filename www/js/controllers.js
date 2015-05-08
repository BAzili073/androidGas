var NUMBER = "+79021201364";
var TEMP = "";
var COMMANDS = {
  RAPORT: "р",
  SET_PHONE: function(id, phone){ return 'нн ' + id + ' ' + phone;},
  SET_NSOPTIONS: function( startS,rGuard,rapCommands,blockOutput,useInput,smsAlarm,autoGuard,errorSms,timeAlarm,timeWaitGuard){
 return 'нc ' + [startS, rGuard, rapCommands, blockOutput, useInput, smsAlarm,
     autoGuard, errorSms].map(function(i){return i ? 1 : 0;}).join('') + timeAlarm + timeWaitGuard}
}

var READ_INTERVAL = 1000;

angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $interval, $localstorage, $ionicModal, $timeout, $ionicPopup) {

  $scope.sms = {
    init: true
  };

  $scope.phones = $localstorage.getObject('phones', {
    pot: NUMBER,
    balance: "",
    master: "",
    ext1: "",
    ext2: "",
    ext3: "",
    ext4: ""
  });

  $scope.nsOptions = $localstorage.getObject('nsOptions', {
       timeAlarm: 3,
       timeWaitGuard: 0,
       startS : false,
       rGuard : false,
       rapCommands : false,
       blockOutput : false,
       useInput : false,
       smsAlarm : false,
       autoGuard : false,
       errorSms : false
  });

  $scope.pot = {
    on: false,
    inputs: [0,0,0,0,0,0,0,0],
    outputs: [0,0],

    pot1: 8,
    pot2: 8,
    pot3: 8
  };

  $scope.lastSMS = '';

  $scope.startModal = function(timeout, label, error) {

    $scope.modal = $ionicPopup.show({
      templateUrl: 'templates/modal.html',
      title: label || 'Обработка.',
      scope: $scope,
    });

    $scope.modal.status = 'loading';

    if(timeout)
      $timeout(function(){
        if($scope.modal.status == 'loading') $scope.finishModal();
      }, timeout)
  }

  $scope.finishModal = function() {
    if(!$scope.modal) return;

    $scope.modal.close();
  //  $scope.modal = null;
  }

  $scope.completeModal = function() {
    if(!$scope.modal) return;

    $scope.modal.status = 'complete';
  }

  $scope.errorModal = function() {
    if(!$scope.modal) return;

    $scope.modal.status = 'error';
  }

  $scope.saveData = function(key) {
    $localstorage.setObject(key, $scope[key]);
  }

  $scope.setPotNumber = function(value){
    $scope.startModal(1000);
    $scope.phones.pot = value;
    $scope.saveData('phones');
    $scope.completeModal();
  }
  $scope.setBalanceNumber = function(value){
    $scope.startModal(1000);
    $scope.phones.balance = value;
    $scope.saveData('phones');
    $scope.completeModal();
  }

  $scope.updateNumber = function(id, phone){
    $scope.startModal(5000);

    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_PHONE(id, phone), function(){

      switch(id){
        case 0: $scope.phones.master = phone;break;
        case 1: $scope.phones.ext1 = phone;break;
        case 2: $scope.phones.ext2 = phone;break;
        case 3: $scope.phones.ext3 = phone;break;
        case 4: $scope.phones.ext4 = phone;break;
      }

      $scope.completeModal();

    }, $scope.errorModal);

  }

  $scope.receiveSMS = function(sms){
      $scope.lastSMS = JSON.stringify(sms);
  }

  $scope.initSMS = function() {

    if(!$scope.sms.init) {
      $scope.startModal(30000, "Загрузка данных");
      SMS.sendSMS($scope.phones.pot, COMMANDS.RAPORT, $scope.finishModal, $scope.errorModal);
    }

    $interval (function(){

      var filter = {
            box : 'inbox',
            read : 0,
            address : $scope.phones.pot,
        };

        if(window.SMS) SMS.listSMS(filter, function(data){
            if(Array.isArray(data)) {
                for(var i in data) {
                    if (data[i].address == $scope.phones.pot)
                    $scope.receiveSMS(data[i]);
                }
            }
        }, function(err) { $scope.startModal(null, "Не могу прочитать SMS", true) });

    }, READ_INTERVAL)
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
      { id: -2, label: 'Баланс'},
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
         case -2: $scope.phoneNumber = $scope.phones.balance;break;
         case -1: $scope.phoneNumber = $scope.phones.pot;break;
         case 0: $scope.phoneNumber = $scope.phones.master;break;
         case 1: $scope.phoneNumber = $scope.phones.ext1;break;
         case 2: $scope.phoneNumber = $scope.phones.ext2;break;
         case 3: $scope.phoneNumber = $scope.phones.ext3;break;
         case 4: $scope.phoneNumber = $scope.phones.ext4;break;
       }
    }

    $scope.setPhone = function(){
     if ($scope.selected.id < 0 ){
      if ($scope.selected.id == -1 ) $scope.setPotNumber($scope.phoneNumber);
      if ($scope.selected.id == -2 ) $scope.setBalanceNumber($scope.phoneNumber);
  }else
      $scope.updateNumber($scope.selected.id, $scope.phoneNumber);
    }

    $scope.resetForm();
})


.controller('saturnOptionsController', function($scope){
  $scope.timeAlarmOptions = [
    { id: 0, label: '0'},
    { id: 1, label: '20'},
    { id: 2, label: '40'},
    { id: 3, label: '60'},
    { id: 4, label: '80'},
    { id: 5, label: '100'},
    { id: 6, label: '120'},
    { id: 7, label: '140'},
    { id: 8, label: '160'},
    { id: 9, label: '180'}
  ];

  $scope.timeWaitGuardOptions = [
    { id: 0, label: '0'},
    { id: 1, label: '35'},
    { id: 2, label: '70'},
    { id: 3, label: '105'},
    { id: 4, label: '140'},
    { id: 5, label: '175'},
    { id: 6, label: '210'},
    { id: 7, label: '245'},
    { id: 8, label: '280'},
    { id: 9, label: '315'}
  ];

  $scope.timeAlarmselected = $scope.timeAlarmOptions[$scope.nsOptions.timeAlarm];
  $scope.timeWaitGuardselected = $scope.timeAlarmOptions[$scope.nsOptions.timeWaitGuard];

  $scope.nsCheckbox = {
       startS : $scope.nsOptions.startS,
       rGuard : $scope.nsOptions.rGuard,
       rapCommands : $scope.nsOptions.rapCommands,
       blockOutput : $scope.nsOptions.blockOutput,
       useInput : $scope.nsOptions.useInput,
       smsAlarm : $scope.nsOptions.smsAlarm,
       autoGuard : $scope.nsOptions.autoGuard,
       errorSms : $scope.nsOptions.errorSms
     };

     $scope.setNsOptions = function(){
       $scope.startModal(5000);
       if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_NSOPTIONS($scope.nsCheckbox.startS, $scope.nsCheckbox.rGuard,$scope.nsCheckbox.rapCommands,
         $scope.nsCheckbox.blockOutput,$scope.nsCheckbox.useInput,$scope.nsCheckbox.smsAlarm,$scope.nsCheckbox.autoGuard,
         $scope.nsCheckbox.errorSms,$scope.timeAlarmselected.id,$scope.timeWaitGuardselected.id), function(){

         $scope.nsOptions.startS = $scope.nsCheckbox.startS;
         $scope.nsOptions.rGuard = $scope.nsCheckbox.rGuard;
         $scope.nsOptions.rapCommands = $scope.nsCheckbox.rapCommands;
         $scope.nsOptions.blockOutput = $scope.nsCheckbox.blockOutput;
         $scope.nsOptions.useInput = $scope.nsCheckbox.useInput;
         $scope.nsOptions.smsAlarm = $scope.nsCheckbox.smsAlarm;
         $scope.nsOptions.autoGuard = $scope.nsCheckbox.autoGuard;
         $scope.nsOptions.errorSms = $scope.nsCheckbox.errorSms;
         $scope.nsOptions.timeAlarm = $scope.timeAlarmselected.id;
         $scope.nsOptions.timeWaitGuard = $scope.timeWaitGuardselected.id;
         $scope.saveData('nsOptions');
         $scope.completeModal();

       }, $scope.errorModal);

     }
})
