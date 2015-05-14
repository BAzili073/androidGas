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
  SET_NDOPTION: function(acccess1,acccess2,acccess3,acccess4){ return 'нд ' + acccess1 + acccess2 +  acccess3 + acccess4;},
  SET_VSOPTION: function(number,minV,maxV,minT,inactiveT,waitT,mode,output){ return 'вс' + number + ' ' + minV + maxV + minT + inactiveT +
   waitT + mode + output;},
  SET_TEXT: function(id,text){
      if (id < 6)
        {return 'сс' + id + ' ' + text;}
      else
        {return 'см' + (id-5) + ' ' + text;}
      },
  DEL_TMTERM: function(what){ return 'с' + what;},
  RESET_DEVICE: function(){ return 'ресет';},
  CHECK_BALANCE: function(number){ return 'б ' + number;},
  SET_GUARD: function(state){ return 'o'+state;},
  SET_OUTPUT: function(number,state){ return 'o'+number + ' ' + state;},
  SET_TEMPTEXT: function(number,min,max){ return 'т'+number + 'с' +' '+ min + max;},
  SET_TEMPOUT: function(number,output,min,max){ return 'т'+ number + 'в' + output +' '+ min + max;},
}

var SMS_REGEX = {
    REPORT_GUARD: /вх:([+,-]*) вых:([0,1]*) (сеть 220В|акк!)/
}

var READ_INTERVAL = 1000;

var DATA_VERSION = "0.1.7";

angular.module('starter.controllers', ['starter.services', 'starter.constants'])

.controller('AppCtrl', function($scope, $interval, $localstorage, $ionicModal, $timeout, $ionicPopup) {
  $scope.post = {url: 'http://', title: ''};
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
      guardOutput: ["1","2","3","4"],
      moduleOutput: ["1","2","3","4"],
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

  $scope.ndOptions = $localstorage.getObject('ndOptions', {
    numberAccess: [0,0,0,0]
  });

  $scope.temperature = $localstorage.getObject('temperature', {
    nowTemp: ["+40","-50","-30","+1","+10"],
    minText: [-99,-99,-99,-99,-99],
    maxText: [99,99,99,99,99],
    minOut: [-99,-99,-99,-99,-99],
    maxOut: [99,99,99,99,99],
    comment:["тем 1","тем 2","тем 3","тем 4","тем 5",],
    optionNow:[0,0,0,0,0],
    lastUse: 0,
  });


  $scope.potContent = $localstorage.getObject('potContent', {
      statToggle: [false,false,false],
      torchToggle: [true,true,true],
      potState: [2,2,2],
      inputs: [false,false,false,false,false,false,false,false],
      outputs: [false,false],
  });

  $scope.guardContent = $localstorage.getObject('guardContent', {
      stateGuard: true,//true = on false = off
      statusGuard: 1, //0 - off, 1 - on, 2> - alarm
      power: true, //220
      inputs: [false, false, false, false, false], // true - alarm, false - ok
      outputs: [false, false, false, false],// true - on, false - off
      guardState: 0,
  });


  $scope.lastSMS = '';
  
  $scope.changeLastUse = function(id){
    $scope.temperature.lastUse = id;
  }
  $scope.saveOutputComment = function(text,id){
    $scope.guardContent.outputsComm[id] = text;
  }

  $scope.setColors = function(data){
    if (data == true) return "assertive";
     else return "balanced";
  }

  $scope.setOutputColors = function(data){
    if (data == true) return "calm";
     else return "stable";
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
