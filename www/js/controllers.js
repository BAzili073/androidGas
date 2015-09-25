var NUMBER = "+79021201364";

var SMS_LIMIT = 0;

var TIME_WAIT_OPERATION = 200;

var TIME_WAIT = 100;

var MUSIC_SRC = "/android_asset/www/alarm.mp3";

var GUARD_STATES=[
  {text : "Снят с охраны", color: "stable"},
  {text: "На охране", color:"balanced"},
  {text : "Ожидание ответа", color: "calm"},
  {text: "Ошибка" , color: "assertive"}
];
var TEMP = "";
var COMMANDS = {
  REPORT: "р",
  SET_PHONE: function(id, phone){ return 'нн ' + id + ' ' + phone;},
  SET_NSOPTIONS: function( startS,rGuard,rapCommands,blockOutput,useInput,smsAlarm,autoGuard,errorSms,timeAlarm,timeWaitGuard) {
    return 'нс ' + [startS, rGuard, rapCommands, blockOutput, useInput, smsAlarm,autoGuard, errorSms].map(function(i){return i ? 1 : 0;}).join('') + timeAlarm + timeWaitGuard
  },
  SET_NROPTION: function(mode1,mode2,mode3,mode4){ return 'нр ' + mode1 + mode2 + mode3 + mode4;},
  SET_NDOPTION: function(acccess1,acccess2,acccess3,acccess4){ return 'нд ' + acccess1 + acccess2 +  acccess3 + acccess4;},
  SET_VSOPTION: function(number,minV,maxV,minT,inactiveT,waitT,mode,output){ return 'вс ' + number + minV + maxV + minT + inactiveT + waitT + mode + output;},
  SET_VMOPTION: function(number,minT,inactiveT,waitT,outOn,outOff){ return 'вм ' + (number-10) + waitT + minT + inactiveT + outOn + outOff;},
  SET_TEXT: function(id,text){ return id < 6 ? 'сс' + id + ' ' + text : 'см' + (id-5) + ' ' + text },
  DEL_TMTERM: function(what){ return 'с' + what;},
  RESET_DEVICE: "ресет",
  CHECK_BALANCE: function(number){ return 'б ' + number;},
  SET_GUARD: function(state){ return 'о'+ (state ? 1:0);},
  SET_OUTPUT: function(number,state){ return 'в'+number + ' ' + (state ? 1:0);},
  CONTROL_POT: function(state,number){ return (state ? 'вкл ':'откл ') + number },
  SET_TEMPTEXT: function(number,min,max){ return 'т'+number + 'с' +' '+ min + max;},
  SET_TEMPOUT: function(number,output,min,max){ return 'т'+ number + 'в' + output +' '+ min + max;},

};

var SMS_REGEX = {
  REPORT_GUARD_1: /(х )?(?:вер:(\d.\d) )?(?:запуск )?(на охране|снят с охраны)(?: т:((?:-?\d;*)*))?(?: тм=(\d*))?/,
  REPORT_GUARD_2: / ?вх:([+-]*)? вых:([01]*)? (220в|акк!)/,
  REPORT_MODULE: /(?:вер:\d.\d )?(?:запуск )?кот:(\d{3}) вх:([01]{8}) вых:([10]{2})/,
  CHANGE_GUARD: /(?:(\d{11})|(?:тм=(\d*))) (на охране|снят с охраны)/,
  SATURN_ALARM: /тревога (\d): [а-я]*/,
  MODULE_ALARM: /(сработал|восстановление) (\d): [а-я]*/,
  POT_MESSAGES: /([\dа-я\s\n]*): котел (\d)/,
  TEMP_MESSAGES:/т(\d)\((-?\d*)\)(<|>| в норме)(-?\d*)?/,
  POWER: /(отказ|восстановление) 220в/,
  SENSOR: /(отказ|восстановление) термодатчика:(\d)(?:\((-?\d*)\))?/,
  ERROR_SMS: /ошибка:([\dа-я\s\n]*)/,
  ERROR_MODULE: /отказ дополнительного модуля/,
  ACC_OPTIONS_SMS:/принято ?(нс|нр|сс|см|нн|нд|тс|тв|dc)?/
};

var READ_INTERVAL = 10000;

var DATA_VERSION = "1.9.5";

var DEFAULT_DATA = {

  lastSmsTime: "Небыло",

  phones: {
    pot: NUMBER,
    balance: "",
    master: "",
    ext1: "",
    ext2: "",
    ext3: "",
    ext4: ""
  },

  ssOptions:{
    text: ["вход 1","вход 2","вход 3","вход 4","вход 5","доп.вход 1","доп.вход 2","доп.вход 3","доп.вход 4","доп.вход 5","доп.вход 6","доп.вход 7","доп.вход 8"],
  },

  nsOptions:{
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
  },

  vsOptions:{
    minVoltage: [2,2,2,2,2],
    maxVoltage:[7,7,7,7,7],
    minTime: [0,0,0,0,0],
    inactiveTime:[0,0,0,0,0],
    waitTime:[0,0,0,0,0],
    modeInput:[0,0,0,0,0],
    outInput:[0,0,0,0,0],
    minTimeModule: [0,0,0,0,0,0,0,0],
    inactiveTimeModule:[0,0,0,0,0,0,0,0],
    waitTimeModule:[0,0,0,0,0,0,0,0],
    outInputOnModule: [0,0,0,0,0,0,0,0],
    outInputOffModule: [0,0,0,0,0,0,0,0],
  },

  nrOptions:{
    modeOutput: [0,0,0,0],
    guardOutput: ["Выход 1","Выход 2","Выход 3","Выход 4"],
    moduleOutput: ["доп.выход 1","доп.выход 2"],
  },

  ndOptions:{
    numberAccess: [0,0,0,0]
  },

  temperature:{
    nowTemp: ["","","","",""],
    minText: [-99,-99,-99,-99,-99],
    maxText: [99,99,99,99,99],
    minOut: [-99,-99,-99,-99,-99],
    maxOut: [99,99,99,99,99],
    comment:["Датчик 1","Датчик 2","Датчик 3","Датчик 4","Датчик 5",],
    optionNow:[0,0,0,0,0],
    lastUse: 0,
  },

  potContent:{
    setModule: true,
    seePot: [true,true,true],
    statToggle: [false,false,false],
    torchToggle: [true,true,true],
    potState: [9,9,9],
    inputs: [false,false,false,false,false,false,false,false],
    errorModule: false,
  },

  guardContent:{
    stateGuard: false,//true = on false = off
    statusGuard: 2, //0 - off, 1 - on, 2-wait 3> - alarm
    power: true, //220
    inputs: [false, false, false, false, false], // true - alarm, false - ok
    guardState: 0,
    counterTM:0,
    keyTMName:[1,"","","","","","","","","","","","","","",""],
    whoChangeGuard:"",
  },

  handContent:{
    outputsSaturn: [false, false, false, false],// true - on, false - off
    outputsModule: [false, false],// true - on, false - off
  },

  optionContent:{
    nd:1,
    ns:1,
  }

};



var DATA_KEYS = ['lastSmsTime','phones', 'ssOptions', 'nsOptions', 'vsOptions', 'nrOptions', 'ndOptions', 'temperature', 'potContent', 'guardContent', 'handContent'];
var TAB_ACTIVE = 1;
angular.module('starter.controllers', ['starter.services', 'starter.constants', 'starter.directives','ngCordova'])
.controller('AppCtrl', function($cordovaSplashscreen,$cordovaDevice,$scope,$cordovaToast,$cordovaVibration,$cordovaMedia, $cordovaFile, $state,$ionicHistory, $window, $interval, $localstorage, $ionicModal, $timeout, $ionicPopup) {
  $scope.post = {url: 'http://', title: ''};
  $scope.sms = {
    init: true
  };
  $localstorage.checkVersion(DATA_VERSION);

  $scope.timelastSMS;
  $scope.lastSMS = '';
  $scope.lastObjId = '';
  $scope.counter = 1;
  $scope.lastIdTMName;


  $scope.getDataVersion = function(){
    return DATA_VERSION;
  }
  $scope.appVariables = $localstorage.getObject('appVariables',{
    lastIdSms: 1,
    counterSmsRec: 0,
    firstStart: true,
    seeNotification: true,
    optionPassword: true,
  });

  $scope.objects = $localstorage.getObject('objects',{
    // items:[],
    items : [{id:0,label: "Тестовый",number: NUMBER,unReadSms: false}],

  });

  $scope.deviceVar = {device: false, historyFile:false, settingMode: false, playLoopAlarm:false, presenceObject:false,devicePause:false}

  $scope.callPhone = function(onSuccess,onError,number){
    if ($scope.deviceVar.device)window.plugins.CallNumber.callNumber(onSuccess, onError, number);
    else onSuccess();
  }
  $scope.showToast = function(text){
    if ($scope.deviceVar.device)
      $cordovaToast.showLongBottom(text);
    else console.log("Уведомление->  " + text);
  }

  $scope.saveHistory = function(time,text){
    TIME_WAIT = TIME_WAIT + TIME_WAIT_OPERATION;
    $timeout(function(){
        if ($scope.deviceVar.historyFile) $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, "history.txt", time + "   ::::   " + text + "\n")
        else console.log( "Запись в историю->  "+ time + "   ::::   " + text + "\n");
        TIME_WAIT = TIME_WAIT - TIME_WAIT_OPERATION;
    },TIME_WAIT);
  }

  $scope.sendSmsMessage = function(text,success,error,data){
    var ok = 0;
    if (!$scope.deviceVar.device) {
      console.log("SMS-> " + $scope.phones.pot + " текст: " + text);
      success(data);
      $scope.saveHistory($scope.getCurrentTime()," |-> " + $scope.phones.pot + " текст: " + text)
    }
    if (!$scope.deviceVar.settingMode){
        if(window.SMS)
        SMS.sendSMS($scope.phones.pot, text,
          function(){$timeout(function(){
            success(data);
            ok = 1;
            $scope.saveHistory($scope.getCurrentTime()," |-> " + $scope.phones.pot + " текст: " + text)
          }, 500)},
          function(){$timeout(function(){
              if (ok != 1) error();}, 1000)
          })
      }else{
        success(data);
        $scope.saveHistory($scope.getCurrentTime()," Режим настройки |-> " + "текст: " + text)
        }
  }

  $scope.timeConverter = function (UNIX_timestamp){
    var a = new Date(UNIX_timestamp*1000);
    var months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = function(){if(a.getDate() < 10) return "0" + a.getDate(); else return a.getDate();}
    var hour = function(){if(a.getHours() < 10) return "0" + a.getHours(); else return a.getHours();}
    var min = function(){if(a.getMinutes() < 10) return "0" + a.getMinutes(); else return a.getMinutes();}
    var sec = function(){if(a.getSeconds() < 10) return "0" + a.getSeconds(); else return a.getSeconds();}
    var time = date() + ',' + month + ' ' + year + ' ' + hour() + ':' + min() + ':' + sec() ;
    return time;
  }

  $scope.getCurrentTime = function(){
    var currentTime = new Date()/1000;
    return $scope.timeConverter(currentTime);
  }

  $scope.getTabActive = function(tab){
    if (tab==TAB_ACTIVE) return "active"
  }

  $scope.getIndexCurrentPot = function(){
    var ind = _.findIndex($scope.objects.items, function(chr) {
      return chr.id == $scope.potNumber;
    });
    return ind;
  }

  $scope.currentPot = function() {
    return _.find($scope.objects.items, {id: $scope.potNumber});
  }
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

  $scope.setPot = function(num){
    $scope.potNumber = $scope.objects.items[num].id;
    $scope.loadAllData();
  }

  $scope.saveObjects = function(key) {
    $localstorage.setObject(key, $scope[key]);
  }
  $scope.saveData = function(key) {
    $localstorage.setObject(key + "_" + $scope.potNumber, $scope[key]);
    // console.log(key + "_" + $scope.potNumber);
  }

  $scope.loadData = function(key) {
    $scope[key] = $localstorage.getObject(key + "_" + $scope.potNumber, _.cloneDeep(DEFAULT_DATA[key]));
  }

  $scope.deletePotData = function(numberObject) {
    console.log(numberObject);
    DATA_KEYS.forEach(function(key){
      localStorage.removeItem(key + "_" + numberObject);
      // console.log(key + "_" + numberObject);
    });
  }

  $scope.loadAllData = function() {
    DATA_KEYS.forEach(function(key){
      $scope.loadData(key);
    });
  }
  $scope.loadAllVar = function() {
      $scope.setPot(0);
      $scope.objects = $localstorage.getObject('objects');
      $scope.appVariables = $localstorage.getObject('appVariables');
  }

  $scope.saveAllData = function() {
    DATA_KEYS.forEach(function(key){
      $scope.saveData(key);
    });
  }

  $scope.setPotNumber = function(value){
    // $scope.startModal(1000);
    $scope.phones.pot = value;
    $scope.objects.items[$scope.getIndexCurrentPot()].number = value;
    $scope.saveObjects('objects');
    $scope.saveData('phones');
    // $scope.completeModal();
    // $cordovaToast.showLongBottom('Выполнено');
  }
  $scope.setBalanceNumber = function(value){
    $scope.startModal(1000);
    $scope.phones.balance = value;
    $scope.saveData('phones');
    $scope.completeModal();
  }

  $scope.updateNumberSuccesful = function(data){
    switch(data[0]){
      case 0: $scope.phones.master = data[1];break;
      case 1: $scope.phones.ext1 = data[1];break;
      case 2: $scope.phones.ext2 = data[1];break;
      case 3: $scope.phones.ext3 = data[1];break;
      case 4: $scope.phones.ext4 = data[1];break;
    }
    $scope.completeModal();
  }

  $scope.updateTextSuccessful = function(data){
    $scope.ssOptions.text[data[0]-1] = data[1];
    $scope.saveData('ssOptions');
    $scope.completeModal();
  }

  $scope.updateNumber = function(id, phone){
    $scope.startModal(5000);
    var data = [id,phone];
    $scope.sendSmsMessage(COMMANDS.SET_PHONE(id, phone),$scope.updateNumberSuccesful,$scope.errorModal,data)
  }



  $scope.updateText = function(id,text){
    $scope.startModal(5000);
    var data = [id,text]
    $scope.sendSmsMessage(COMMANDS.SET_TEXT(id, text),$scope.updateTextSuccessful,$scope.errorModal,data)
  }

  $scope.smsRequestBalance = function(){
    $scope.startModal(5000);
    $scope.sendSmsMessage(COMMANDS.CHECK_BALANCE($scope.phones.balance),$scope.toggleSendSuccesful,$scope.errorModal)
  }

  $scope.smsRequestReport = function(){
    $scope.startModal(5000);
    $scope.sendSmsMessage(COMMANDS.REPORT,$scope.toggleSendSuccesful,$scope.errorModal,data);
  }
  $scope.clearTemperature = function(){
    return $scope.temperature.nowTemp//.map(function(){ return " "});
  }
  $scope.reportGuard_2 = function(body){
    var data = SMS_REGEX.REPORT_GUARD_2.exec(body);
    if (data[1]) $scope.guardContent.inputs = data[1].split("").map(function(i){ return i === "+" });
    if (data[2]) $scope.handContent.outputsSaturn = data[2].split("").map(function(i){ return i === "1" });
    if (data[3]) $scope.guardContent.power = data[3].indexOf("220") >= 0;
  }
  $scope.reportGuard = function(body) {
    if (SMS_REGEX.REPORT_GUARD_1.test(body))
    {
      var data = SMS_REGEX.REPORT_GUARD_1.exec(body);
      if (data[1]=="х ") $scope.errorModule(body);
      $scope.temperature.nowTemp = $scope.temperature.nowTemp.map(function(i){return ""; });
      if (data[3]) $scope.guardContent.stateGuard = data[3].indexOf("на охране") >= 0;
      if (data[3]) $scope.guardContent.statusGuard = (data[3].indexOf("на охране") >= 0) ? 1:0;
      if (data[4]) $scope.temperature.nowTemp = data[4].split(";").map(function(i){ if (i>0){ return "+" + i} else {return i}})
      if (data[5]) $scope.guardContent.counterTM = data[5]
    }
    if (SMS_REGEX.REPORT_GUARD_2.test(body)) $scope.reportGuard_2(body);
    $scope.saveData('guardContent');
    $scope.saveData('temperature');
    $scope.saveData('handContent');
  }

  $scope.reportModule = function(body) {
    var data = SMS_REGEX.REPORT_MODULE.exec(body);
    $scope.potContent.errorModule = false;
    $scope.potContent.potState = data[1].split("");
    $scope.potContent.statToggle = data[1].split("").map(function(i){
      if (i == 0) return false;
      if (i == 1) return true;});
      $scope.potContent.inputs = data[2].split("").map(function(i){ return i === "1" });
      $scope.handContent.outputsModule = data[3].split("").map(function(i){ return i === "1" });
      $scope.saveData('potContent');
      $scope.saveData('handContent');
    }

    $scope.changeGuard = function(body) {
      var data = SMS_REGEX.CHANGE_GUARD.exec(body);
      if (data[1]) $scope.guardContent.whoChangeGuard = "(" + data[1] + ")"
      else{
        if ($scope.guardContent.keyTMName[data[2]]) $scope.guardContent.whoChangeGuard = " (" + $scope.guardContent.keyTMName[data[2]] + ")"
        else $scope.guardContent.whoChangeGuard = " (TM = " + data[2] + ")"
      }
      $scope.guardContent.stateGuard = data[3].indexOf("на охране") >= 0;
      $scope.guardContent.statusGuard = (data[3].indexOf("на охране") >= 0) ? 1:0;
      $scope.saveData('guardContent');
    }

    $scope.saturnAlarm = function(body) {
      var data = SMS_REGEX.SATURN_ALARM.exec(body);
      $scope.guardContent.inputs[data[1]-1] = true;
      $scope.saveData('guardContent');
      $scope.playAlarm(body);
    }
    $scope.moduleAlarm = function(body) {
      var data = SMS_REGEX.MODULE_ALARM.exec(body);
      $scope.potContent.inputs[data[2]-1] = data[1].indexOf("сработал") >= 0;
      $scope.saveData('potContent');
      $scope.playAlarm(body);
    }
    $scope.saturnPower = function(body) {
      var data = SMS_REGEX.POWER.exec(body);
      $scope.guardContent.power = data[1].indexOf("восстановление") >= 0;
      if (!$scope.guardContent.power) $scope.playAlarm(body);
      $scope.saveData('guardContent');
    }
    $scope.errorModule = function(body) {
      $scope.potContent.errorModule = true;
      $scope.playAlarm(body);
      $scope.saveData('potContent');
    }

    $scope.potMessages = function(body) {
      var data = SMS_REGEX.POT_MESSAGES.exec(body);
      // console.log (data[1])
      switch(data[1]){
        case "остановка":$scope.potContent.potState[data[2]-1]=0;break;
        case "запуск":$scope.potContent.potState[data[2]-1]=1;break;
        case "нет пламени":$scope.potContent.potState[data[2]-1]=2;break;
        case "перегрев теплоносителя 1":$scope.potContent.potState[data[2]-1]=3;break;
        case "нет тяги":$scope.potContent.potState[data[2]-1]=4;break;
        case "перегрев теплоносителя 2":$scope.potContent.potState[data[2]-1]=5;break;
        case "низкое напряжение":$scope.potContent.potState[data[2]-1]=6;break;
        case "нет нагрева теплоносителя":$scope.potContent.potState[data[2]-1]=7;break;
        case "нет ответа":$scope.potContent.potState[data[2]-1]=8;break;
      }
      if ($scope.potContent.potState[data[2]-1] > 1) $scope.playAlarm(body);
      $scope.saveData('potContent');
    }

    $scope.tempMessages = function(body) {
      var data = SMS_REGEX.TEMP_MESSAGES.exec(body);
      // console.log(data);
      $scope.temperature.nowTemp[data[1]-1]
      if (data[2]>0) $scope.temperature.nowTemp[data[1]-1] = "+" + data[2];
      else $scope.temperature.nowTemp[data[1]-1] = data[2];
      if (data[3] != " в норме") $scope.playAlarm("тревога температуры");
      $scope.saveData('temperature');
    }
    $scope.errorSms = function(body) {
      var data = SMS_REGEX.ERROR_SMS.exec(body);
      $scope.playAlarm(data[1]);
      // console.log(data);
    }

    $scope.acceptOptions = function(body) {
      var data = SMS_REGEX.ACC_OPTIONS_SMS.exec(body);
      var command = "";
      switch (data[1]) {
        // console.log("switch");
          case "нс":
              command = "настройки сатурна";
          break;
          case "нн":
              command = "настройки номера";
          break;
          case "нн":
              command = "настройки входа сатурна";
          break;
          case "нд":
              command = "настройки доступа";
          break;
          case "тс":
              command = "настройки оповещения по термодатчику";
          break;
          case "тв":
              command = "настройки управления по термодатчику";
          break;
          case "сс":
              command = "настройки сообщений сатурна";
          break;
          case "см":
              command = "настройки сообщений модуля";
          break;
          case "нр":
              command = "настройки выходов сатурна";
          break;
          default:
            command = data[1];
          break;
      }
      var sms_acceptOption = $ionicPopup.show({
        template: "Команда " + command  + " принята",
        title: '<div class = ""> Объект:</div><div>'  + $scope.currentPot().label + '</div>',
        scope: $scope,
        buttons: [
          {
            text: '<b>Принять</b>',
            type: 'button-positive',
            onTap: function(e) {
            }
          }
        ]
      });
    }


    $scope.sensorMessage = function(body){
      var data = SMS_REGEX.SENSOR.exec(body);
      if (data[1] == "отказ"){
        $scope.temperature.nowTemp[data[2]-1] = -255;
      }else{
        if (data[3]>0) data[3] = "+" + data[3];
        $scope.temperature.nowTemp[data[2]-1] = data[3];
      }
      $scope.saveData('temperature');
    }


    $scope.receiveSMS = function(sms){
      if (($scope.deviceVar.devicePause) && ($scope.appVariables.seeNotification)) cordova.plugins.notification.badge.increase();
      $scope.appVariables.counterSmsRec = $scope.appVariables.counterSmsRec + 1;
      $scope.lastSMS = JSON.stringify(sms);
      $scope.appVariables.lastIdSms = sms.date/1000;
      $scope.saveObjects('appVariables');
      $scope.getLastSmsTime(sms.date/1000);
      $scope.saveHistory($scope.timeConverter(sms.date/1000)," |<- " + sms.address + " текст: " + sms.body)

      var body = sms.body;
      switch(true){
        case SMS_REGEX.CHANGE_GUARD.test(body): $scope.changeGuard(body); break;
        case SMS_REGEX.REPORT_GUARD_1.test(body): $scope.reportGuard(body); break;
        case SMS_REGEX.REPORT_GUARD_2.test(body): $scope.reportGuard(body); break;
        case SMS_REGEX.REPORT_MODULE.test(body): $scope.reportModule(body); break;
        case SMS_REGEX.SATURN_ALARM.test(body): $scope.saturnAlarm(body); break;
        case SMS_REGEX.MODULE_ALARM.test(body): $scope.moduleAlarm(body); break;
        case SMS_REGEX.POWER.test(body): $scope.saturnPower(body); break;
        case SMS_REGEX.POT_MESSAGES.test(body): $scope.potMessages(body); break;
        case SMS_REGEX.ERROR_MODULE.test(body): $scope.errorModule(body); break;
        case SMS_REGEX.TEMP_MESSAGES.test(body): $scope.tempMessages(body); break;
        case SMS_REGEX.ERROR_SMS.test(body): $scope.errorSms(body); break;
        case SMS_REGEX.ACC_OPTIONS_SMS.test(body): $scope.acceptOptions(body); break;
        case SMS_REGEX.SENSOR.test(body): $scope.sensorMessage(body); break;
        default:
            console.warn("Undefined sms received: ", body);
            var undefined_sms = $ionicPopup.show({
              template: 'Смс:' + body ,
              title: '<div class = ""> Нераспознанная смс! Объект:</div><div>'  + $scope.currentPot().label + '</div>',
              scope: $scope,
              buttons: [
                {
                  text: '<b>Принять</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                  }
                }
              ]
            });
            // $scope.smsOtherObj(,body,"Смс нераспознано!");
        break;
      }
      $state.go($state.current, {}, {reload: true});
    }

    $scope.getFileAccess = function() {
      $cordovaFile.checkFile(cordova.file.externalDataDirectory, "history.txt")
      .then(function (success) {
          $scope.showToast("Успешно");
          $scope.deviceVar.historyFile = true;
      }, function (error) {
        $cordovaFile.createFile(cordova.file.externalDataDirectory, "history.txt", true)
        .then(function (success) {
          $scope.showToast("Создание файла истории");
          $scope.deviceVar.historyFile = true;
        }, function (error) {
          $scope.showToast("Ошибка создания файла");
        });
      });
    }

    $scope.testText = function(){
      $scope.counter = $scope.counter + 1;
      $scope.intext = $scope.counter + '\n'
      $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, "history.txt", $scope.intext)
    }

    $scope.errorFileAccess = function() {
      $scope.showToast("Нет доступа к системе");
    }
    $scope.objectEditor = function(){
      $state.go("app.objectEditor");
    }

    $scope.checkObjects = function(){
        if ($scope.objects.items.length == 0) $scope.objectEditor();
        else  {
          $scope.deviceVar.presenceObject = true;
          $scope.setPot(0);
          }
    }

    $scope.exitServiceGas = function(){
      if ($scope.deviceVar.device) navigator.app.exitApp()
      else console.log("Закрытие приложения");
    }

    $scope.startApplication = function(){
      $scope.saveHistory($scope.getCurrentTime(),"Запуск приложения");
    }
    $scope.unReadSmsSet = function(val){
        $scope.objects.items[$scope.getIndexCurrentPot()].unReadSms = val;
        $scope.saveObjects('objects');
    }
    $scope.unReadSmsGet = function(currentId){
      if ($scope.getObjectFromId(currentId).unReadSms)
      return true;
      else false;
    }
    $scope.firstStartApp = function(){
       var text = "Вы используете пробную версию! Ограничение по приему смс! Оставшееся количество смс:" + (SMS_LIMIT - $scope.appVariables.counterSmsRec)

       var firstStartPopup = $ionicPopup.show({
         template: text,
         title: '<div class = "item assertive"> Пробная версия!</div>',
         scope: $scope,
         buttons: [
           {
             text: '<b>Принять</b>',
             type: 'button-positive',
             onTap: function(e) {
             }
           }
         ]
       });
    }
    // if (SMS_LIMIT) $timeout($scope.firstStartApp,2000);
    $scope.checkObjects();
    $scope.deviceready = function() {


            console.log($cordovaDevice.getDevice());
            console.log($cordovaDevice.getCordova())
            console.log($cordovaDevice.getModel());
            console.log($cordovaDevice.getPlatform());
            console.log($cordovaDevice.getUUID());
            console.log($cordovaDevice.getVersion());


      $scope.deviceVar.device = true;

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $scope.getFileAccess, $scope.errorFileAccess);
      if(!$scope.sms.init) {
        $scope.startModal(30000, "Загрузка данных");
          $scope.smsRequestReport();
      }

      if (SMS_LIMIT) $timeout($scope.firstStartApp,2000);

      $interval (function(){
        var filter = {
          box : 'inbox',
          // read : 1,
          // address : $scope.phones.pot,
        };
        if(window.SMS && $scope.deviceVar.presenceObject) SMS.listSMS(filter, function(data){
          if(Array.isArray(data)) {
            _.forEachRight(data, function(value, key) {
                    $scope.objects.items.forEach(function(obj){
                      if ((data[key].address == obj.number)  && (data[key].date/1000  >  $scope.appVariables.lastIdSms)){
                            if (obj.id == $scope.currentPot().id){
                            $scope.receiveSMS(data[key]);
                            }
                            else{
                              $scope.lastObjId = $scope.potNumber;
                              $scope.saveAllData();
                              $scope.potNumber = obj.id;
                              $scope.loadAllData();
                              $scope.unReadSmsSet(true);
                              $scope.receiveSMS(data[key]);
                              $scope.saveAllData();
                              $scope.smsOtherObj($scope.currentPot().label,data[key])
                            }
                      }
                    });


            });
          }
        }, function(err) { $scope.startModal(null, "Не могу прочитать SMS", true) });
        if (($scope.appVariables.counterSmsRec > SMS_LIMIT) && (SMS_LIMIT)) { $scope.showToast("Извините, пробный период закончился"); $timeout($scope.exitServiceGas,4000); }
      }, READ_INTERVAL)
      $timeout($scope.startApplication, 3000);
    };

    $scope.clearNotification = function(){
      if ($scope.deviceVar.device) {
        cordova.plugins.notification.badge.clear();
        }
    }
    document.addEventListener('deviceready', $scope.deviceready, false);
    document.addEventListener('pause', function () {
        $scope.deviceVar.devicePause = true;
    }, false);

    document.addEventListener('resume', function () {
        $scope.clearNotification();
        $scope.deviceVar.devicePause = false;
    }, false);

    $scope.getObjectFromId = function(inId){
      return (_.find($scope.objects.items, {id: inId}));
    }
    $scope.getIdFromLabel = function(lab){
      return (_.find($scope.objects.items, {label: lab}).id);
    }

    $scope.getItemLabel = function(currentId){
      return $scope.getObjectFromId(currentId).label;
    }

    $scope.unReadSmsGet = function(currentId){
      if ($scope.getObjectFromId(currentId).unReadSms)
      return true;
      else false;
    }


    $scope.getObjColor = function(id){
      if (id==$scope.potNumber) return "calm";
      else return "light";
    }

    $scope.smsOtherObj = function(lab,body,text){
      if (!text) text = "Активность"
      var seeObj = $ionicPopup.show({
        template: body.body,
        title: text,
        subTitle:'Обеъкт ' + lab,
        scope: $scope,
        buttons: [
          {
            text: '<b>Просмотр</b>',
            type: 'button-stable',
            onTap: function() {
            }
          },
          {
            text: '<b>Закрыть</b>',
            type: 'button-positive',
            onTap: function() {
              $scope.potNumber = $scope.lastObjId;
              $scope.loadAllData();
            }
          }
        ]
      });
    };

    $scope.showObjects = function(){

      var seeObjects = $ionicPopup.show({
        template: '<button  ng-click="chooseObjects(item.id);" class="button button-block button-{{getObjColor(item.id)}} item-icon-right" ng-repeat="item in objects.items">{{getItemLabel(item.id)}}<i ng-show="unReadSmsGet(item.id)" class="icon assertive ion-email"></i></button>',
        title: 'Объекты',
        scope: $scope,
        buttons: [
          {
            text: '<b>Закрыть</b>',
            type: 'button-positive',
          }
        ]
      });

      $scope.chooseObjects = function (id){
            $scope.saveAllData();
            $scope.lastObjId = $scope.potNumber;
            $scope.potNumber = id;
            $scope.loadAllData();
            $scope.unReadSmsSet(false);
            seeObjects.close();
            $state.go($state.current, {}, {reload: true});
            if ((!$scope.potContent.setModule) && (($state.current.url == "/pots") || ($state.current.url == "/pot/"))) {
              $scope.potNumber = $scope.lastObjId;
              $scope.loadAllData();
               $scope.showToast("Объект без доп. модуля");
            }
      }
    };

    $scope.checkOptionPass = function() {
      if (!$scope.appVariables.optionPassword) $state.go("app.option.index");
      else{
          $scope.data = {
            password: [], //пароль
          }

          // An elaborate, custom popup
          var password = $ionicPopup.show({
            template: '<input type="password" placeholder=" Введите код доступа" ng-model="data.password">',
            title: 'Вход в настройки',
            scope: $scope,
            buttons: [
              {
                text: '<b>Принять</b>',
                type: 'button-positive',
                onTap: function(e) {
                  return $scope.data;
                }
              }
            ]
          });

          password.then(function(data) {
            $scope.saveHistory($scope.getCurrentTime(),"Вход в настройки (" + $scope.data.password +")");
            if ($scope.data.password == "2714") {
              $state.go("app.option.index");
            } else {
              var  error = $ionicPopup.show({
                title: 'Код доступа неверный',
                buttons: [ { text: 'OK', type: 'button-assertive' } ]
              });

            }

          });
        };
    };
    $scope.data1 = [
      // {body : "снят с охраны т:16;24;-2 вх:+--+- вых:0000 220в "},
      // {body : "вер:3.1 снят с охраны т:26 тм=2"},
      // {body : "вер:3.5 запуск снят с охраны вх:+--+- вых:11100 220в "},
      // {body : " вх:----- вых:00000 220в "},
      // {body : "тм=1 на охране"},
      // {body : "79021201364 на охране"},
      // {body : "принято нс"},
      // {body : "отказ термодатчика:1"},
      {body : "восстановление термодатчика:1(23)"},
      // {body : "тревога 3: взлом двери!"},
      // {body : "восстановление 220в"},
      // {body : "отказ 220в"},
      // {body : "восстановление 3: 220в"},
      // {body : "вер:3.1 запуск кот:101 вх:00110000 вых:10",},
      // {body : "кот:104 вх:00110000 вых:10",},
      // {body: "нет пламени: котел 3"},
      // {body: "перегрев теплоносителя 2: котел 3"},
      // {body: "отказ дополнительного модуля"}
      // {body: "ошибка: подбор тм"}
      // {body: "т1(23) в норме"}
      // {body: "т2(54)>58"}

    ],
    $scope.testsms = function(){
      $scope.data1[0].date = 1438260000000;
      $scope.data1[0].address = "+79021201364";
      $scope.receiveSMS($scope.data1[0]);
    }
    $scope.checkBalance = function(){
      if ($scope.phones.balance != ""){
      $scope.smsRequestBalance();
      } else {
        var  error = $ionicPopup.show({
          title: 'Ошибка',
          subTitle: 'Номер проверки баланса не настроен',
          buttons: [ { text: 'OK', type: 'button-assertive' } ]
        });
      }
    }
    $scope.toggleSendError = function(){
      $scope.showToast('Ошибка');
    }

    $scope.toggleSendSuccesful = function(){
      $scope.showToast('Выполнено');
    }

    $scope.getLastSmsTime = function(time){
      $scope.lastSmsTime = $scope.timeConverter(time);
      $scope.saveData('lastSmsTime');
    }
    $scope.testtimeout = function(){
      $scope.appVariables.lastIdSms = 0;
    }
    $scope.initMusic = function(){
      // if (!media) var media = new Media(src, null, null, null);
      $scope.MusicMedia = $cordovaMedia.newMedia(MUSIC_SRC);
    }

    $scope.loopPlayAlarm = function(){
     if (!$scope.deviceVar.playLoopAlarm) return;
     if ($scope.deviceVar.device) {$scope.controlMusic("play"); $cordovaVibration.vibrate(1000);}
     else console.log("Music->>>  play Alarm!");
     $timeout($scope.loopPlayAlarm, 4500)
    }

    $scope.stopPlayLoopAlarm = function(){
        $scope.deviceVar.playLoopAlarm = false;
        $scope.controlMusic("stop");
    }

    $scope.playAlarm = function(obj){
      $scope.deviceVar.playLoopAlarm = true;
      $scope.loopPlayAlarm();
      var playAlarm = $ionicPopup.show({
        template: '<div class = "item">' + obj + '</div>',
        title: '<div class = "item assertive">' + $scope.currentPot().label + '</div>',
        scope: $scope,
        buttons: [
          {
            text: '<b>Принять</b>',
            type: 'button-positive',
            onTap: function(e) {
               $scope.stopPlayLoopAlarm();
            }
          }
        ]
      });
    }

    $scope.controlMusic = function(cont){

      if ($scope.deviceVar.device){
      if (!$scope.MusicMedia) $scope.initMusic();
      if (cont == "play")
        $scope.MusicMedia.play();
      if (cont == "stop")
        $scope.MusicMedia.stop();}
    }

    $scope.ok = function(){
        $scope.showToast('Выполнено');
    }
    $scope.notok = function(){
        $scope.showToast('Ошибка');
    }

    $scope.setModuleGet = function(){
      if ($scope.deviceVar.presenceObject) return $scope.potContent.setModule;
      else return false
    }

    $scope.smsLimitGet = function(){
      return SMS_LIMIT;
    }

    $scope.fileLocalStorage = function() {
      $cordovaFile.checkFile(cordova.file.externalDataDirectory, "settings.txt")
      .then(function () {
          $cordovaFile.removeFile(cordova.file.externalDataDirectory, "settings.txt");
      }, function () {
        // $scope.showToast("Нету файла настроек");
      });
      $timeout(function(){
        $cordovaFile.createFile(cordova.file.externalDataDirectory, "settings.txt")
        .then(function (success) {
          $scope.showToast("Создание файла настроек");
              $timeout(function(){
                $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory,"settings.txt",$scope.stringStorage)
                .then(function () {
                  $scope.showToast("Настройки сохранены в файл");
                }, function () {
                  $scope.showToast("Ошибка сохранения настроек");
                });
              },3000);
        }, function (error) {
          $scope.showToast("Ошибка файла настроек");
        });
      },2000);
    }

    $scope.saveLocalStorage = function(){
      if (!$scope.deviceVar.device) {$scope.showToast("Функция не доступна");return}
      $scope.saveObjects('objects');
      $scope.saveObjects('appVariables');
      _.forOwn($scope.objects.items,function(value,key){$scope.setPot(key);$scope.saveAllData();});
      $timeout(function(){$scope.stringStorage = $localstorage.saveStorage();},1000);
      $timeout(function(){$scope.fileLocalStorage();},4000);
    }

    $scope.loadLocalStorage = function(){
      if (!$scope.deviceVar.device || SMS_LIMIT) {$scope.showToast("Функция не доступна");return}
      $cordovaFile.checkFile(cordova.file.externalDataDirectory, "settings.txt")
      .then(function () {
        $cordovaFile.readAsText(cordova.file.externalDataDirectory, "settings.txt")
        .then(function () {
          $scope.stringStorage = arguments[0];
          $localstorage.loadStorage($scope.stringStorage);
          $scope.loadAllVar();
          $scope.showToast("Настройки загружены");
        }, function () {
          $scope.showToast("Ошибка чтения файла");
        });
      }, function () {
        $scope.showToast("Файл настроек не найден");
      });
    }

    $scope.lastObject = function(){
        if ($scope.objects.items.length == 1) return false
        else return true;
    }
    $scope.callOnObjectSucc = function(){
      $scope.showToast("Звонок на объект");
      $scope.saveHistory ($scope.getCurrentTime(),"Звонок на объект " + $scope.currentPot().label + "(" + $scope.currentPot().number + ")")
    }
    $scope.callOnObject = function(){
      $scope.callPhone($scope.callOnObjectSucc,false,$scope.currentPot().number);

    }
  })
