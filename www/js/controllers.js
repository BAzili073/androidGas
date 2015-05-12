var NUMBER = "+79021201364";

var GUARD_STATES=[
  {text : "Ожидание ответа", color: "calm"},
  {text: "На охране", color:"balanced"},
  {text : "Снят с охраны", color: "stable"},
  {text: "Ошибка" , color: "assertive"}
]
var TEMP = "";
var COMMANDS = {
  RAPORT: "р",
  SET_PHONE: function(id, phone){ return 'нн ' + id + ' ' + phone;},
  SET_NSOPTIONS: function( startS,rGuard,rapCommands,blockOutput,useInput,smsAlarm,autoGuard,errorSms,timeAlarm,timeWaitGuard){
 return 'нc ' + [startS, rGuard, rapCommands, blockOutput, useInput, smsAlarm,
     autoGuard, errorSms].map(function(i){return i ? 1 : 0;}).join('') + timeAlarm + timeWaitGuard},
  SET_NROPTION: function(mode1,mode2,mode3,mode4){ return 'нр ' + mode1 + mode2 + mode3 + mode4;},
  SET_VSOPTION: function(number,minV,maxV,minT,inactiveT,waitT,mode,output){ return 'вс' + number + ' ' + minV + maxV + minT + inactiveT +
   waitT + mode + output;},
  SET_TEXT: function(id,text){
      if (id < 6)
        {return 'сс' + id + ' ' + text;}
      else
        {return 'см' + (id-5) + ' ' + text;}
      },
}

var SMS_REGEX = {
    REPORT_GUARD: /вх:([+,-]*) вых:([0,1]*) (сеть 220В|акк!)/
}

var READ_INTERVAL = 1000;

var DATA_VERSION = "0.0.1";

angular.module('starter.controllers', ['starter.services', 'starter.constants'])

.controller('AppCtrl', function($scope, $interval, $localstorage, $ionicModal, $timeout, $ionicPopup) {

  $scope.sms = {
    init: true
  };

  $localstorage.checkVersion(DATA_VERSION);

  $scope.phones = $localstorage.getObject('phones', {
    pot: NUMBER,
    balance: "",
    master: "",
    ext1: "",
    ext2: "",
    ext3: "",
    ext4: ""
  });

  $scope.ssOptions = $localstorage.getObject('ssOptions', {
  text: ["вход 1","вход 2","вход 3","вход 4","вход 5","доп.вход 1","доп.вход 2","доп.вход 3","доп.вход 4","доп.вход 5","доп.вход 6","доп.вход 7","доп.вход 8"],

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

  $scope.vsOptions = $localstorage.getObject('vsOptions', {
    minVoltage: [2,2,2,2,2],
    maxVoltage:[7,7,7,7,7],
    minTime: [0,0,0,0,0],
    inactiveTime:[0,0,0,0,0],
    waitTime:[0,0,0,0,0],
    modeInput:[0,0,0,0,0],
    outInput:[0,0,0,0,0]
  });

  $scope.nrOptions = $localstorage.getObject('nrOptions', {
    modeOutput: [0,0,0,0]
  });

  $scope.potContent = $localstorage.getObject('potContent', {
      statToggle: [false,false,false],
      torchToggle: [true,true,true],
      potState: [2,2,2],
      inputs: [true,true,true,true,true,true,true,true],
      outputs: [true,true],
  });

  $scope.guardContent = $localstorage.getObject('guardContent', {
      stateGuard: true,//true = on false = off
      statusGuard: 1, //0 - off, 1 - on, 2> - alarm
      power: true, //220
      inputs: [true, true, true, true, true], // true - ok, false - alarm
      outputs: [true, true, true, true],// true - on, false - off
      guardState: 0
  });


  $scope.lastSMS = '';

  $scope.setColors = function(data){
    if (data == true) return "balanced";
     else return "assertive";
  }

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

  $scope.updateText = function(id,text){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_TEXT(id, text), function(){
          $scope.ssOptions.text[id] = text;
          $scope.saveData('ssOptions');
          $scope.completeModal();
    }, $scope.errorModal);
  }

  $scope.reportGuard = function(body) {
    var data = body.exec(SMS_REGEX.REPORT_GUARD);
    $scope.guardContent.inputs = data[1].split("").map(function(i){ return i === "-" });
    $scope.guardContent.outputs = data[2].split("").map(function(i){ return i === "1" });
    $scope.guardContent.power = data[3].indexOf("220") >= 0;
  }

  $scope.receiveSMS = function(sms){
      $scope.lastSMS = JSON.stringify(sms);

      var body = sms.body;

      switch(true){
        case SMS_REGEX.REPORT_GUARD.test(body): $scope.reportGuard(body);break;
        default: console.warn("Undefined sms received: ", body);
      }
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

.controller('gaspotsController', function($scope, POT_STATES) {

  $scope.getPotState = function(id){
    return POT_STATES[$scope.potContent.potState[id]];
  }

  $scope.getPotStateText = function(id){
    return $scope.getPotState(id).text;
  }

  $scope.getPotColor = function(id){
    return $scope.getPotState(id).color;
    }

    $scope.getInputColor = function(number){
      return $scope.setColors($scope.potContent.inputs[number])
    }
    $scope.getOutputColor = function(number){
       return $scope.setColors($scope.potContent.outputs[number])
      }
})
