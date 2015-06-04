var NUMBER = "+79021201364";

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
    return 'нc ' + [startS, rGuard, rapCommands, blockOutput, useInput, smsAlarm,autoGuard, errorSms].map(function(i){return i ? 1 : 0;}).join('') + timeAlarm + timeWaitGuard
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
  REPORT_GUARD: /(х )?(?:вер:(\d.\d) )?(?:запуск )?(на охране|снят с охраны)(?: т:((?:-?\d;*)*)?(?: тм=(\d*))?)? ?(?:вх:([+-]*) вых:([01]*) (220в|акк!))/,
  REPORT_MODULE: /(?:вер:\d.\d )?(?:запуск )?кот:(\d{3}) вх:([01]{8}) вых:([10]{2})/,
  CHANGE_GUARD: /(?:(\d{11})|(?:тм=(\d*))) (на охране|снят с охраны)/,
  SATURN_ALARM: /тревога(\d): [а-я]*/,
  MODULE_ALARM: /(сработал|восстановление) (\d): [а-я]*/,
  POT_MESSAGES: /([\dа-я\s\n]*): котел (\d)/,
  POWER: /(отказ|восстановление) 220в/,
  ERROR_SMS: /ошибка:([\dа-я\s\n]*)/,
  ERROR_MODULE: /отказ дополнительного модуля/,
  OPTIONS_SMS:/принято ?(нс|нр|сс|см|нн|нд|тс|тв|dc)?/
};

var READ_INTERVAL = 10000;

var DATA_VERSION = "0.5.7";

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



.controller('AppCtrl', function($scope, $cordovaMedia, $cordovaFile, $state,$ionicHistory, $window, $interval, $localstorage, $ionicModal, $timeout, $ionicPopup) {
  $scope.post = {url: 'http://', title: ''};
  $scope.sms = {
    init: true
  };

  $localstorage.checkVersion(DATA_VERSION);

  $scope.timelastSMS;
  $scope.lastSMS = '';
  $scope.lastIdSms = 1;
  $scope.lastObjId = '';

  $scope.objects = $localstorage.getObject('objects',{
    items : [{id:0,label: "Котельная №1",number: NUMBER}],
  });

  $scope.potNumber = $scope.objects.items[0].id;

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
    $scope.potNumber = $scope.objects.items[0].id;
    $scope.loadAllData();
  }

  $scope.saveObjects = function(key) {
    $localstorage.setObject(key, $scope[key]);
  }
  $scope.saveData = function(key) {
    $localstorage.setObject(key + "_" + $scope.potNumber, $scope[key]);
  }

  $scope.loadData = function(key) {
    $scope[key] = $localstorage.getObject(key + "_" + $scope.potNumber, _.cloneDeep(DEFAULT_DATA[key]));
  }

  $scope.deletePotData = function(numberObject) {
    DATA_KEYS.forEach(function(key){
      localStorage.removeItem(key + "_" + numberObject)
    });
  }

  $scope.loadAllData = function() {
    DATA_KEYS.forEach(function(key){
      $scope.loadData(key);
    });
  }

  $scope.saveAllData = function() {
    DATA_KEYS.forEach(function(key){
      $scope.saveData(key);
    });
  }

  $scope.setPotNumber = function(value){
    $scope.startModal(1000);
    $scope.phones.pot = value;
    $scope.objects.items[$scope.getIndexCurrentPot()].number = value;
    $scope.saveObjects('objects');
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

    }, $scope.errorModal());

  }

  $scope.updateText = function(id,text){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_TEXT(id, text), function(){
      $scope.ssOptions.text[id] = text;
      $scope.saveData('ssOptions');
      $scope.completeModal();
    }, $scope.errorModal());
  }

  $scope.smsRequestBalance = function(){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.CHECK_BALANCE($scope.phones.balance), function(){
      $scope.completeModal();
    }, $scope.errorModal());
  }

  $scope.smsRequestReport = function(){
    $scope.startModal(5000);
    SMS.sendSMS($scope.phones.pot, COMMANDS.REPORT, $scope.finishModal, $scope.errorModal());
  }

  $scope.reportGuard = function(body) {
    var data = SMS_REGEX.REPORT_GUARD.exec(body);
    $scope.temperature.nowTemp.map(function(i){ return ""})
    if (data[1]=="х ") $scope.errorModule();
    $scope.guardContent.stateGuard = data[3].indexOf("на охране") >= 0;
    $scope.guardContent.statusGuard = (data[3].indexOf("на охране") >= 0) ? 1:0;
    if (data[4]) $scope.temperature.nowTemp = data[4].split(";").map(function(i){ if (i>0){ return "+" + i} else {return i}})
    $scope.guardContent.counterTM = data[5]
    $scope.guardContent.inputs = data[6].split("").map(function(i){ return i === "+" });
    $scope.handContent.outputsSaturn = data[7].split("").map(function(i){ return i === "1" });
    $scope.guardContent.power = data[8].indexOf("220") >= 0;
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
    if (data[1]) $scope.guardContent.whoChangeGuard = data[1]
    else $scope.guardContent.whoChangeGuard = data[2]
    $scope.guardContent.stateGuard = data[3].indexOf("на охране") >= 0;
    $scope.guardContent.statusGuard = (data[3].indexOf("на охране") >= 0) ? 1:0;
    $scope.saveData('guardContent');
  }

  $scope.saturnAlarm = function(body) {
    var data = SMS_REGEX.SATURN_ALARM.exec(body);
    $scope.guardContent.inputs[data[1]-1] = true;
    $scope.saveData('guardContent');
  }
  $scope.moduleAlarm = function(body) {
    var data = SMS_REGEX.MODULE_ALARM.exec(body);
    $scope.potContent.inputs[data[2]-1] = data[1].indexOf("сработал") >= 0;
    $scope.saveData('potContent');
  }
  $scope.saturnPower = function(body) {
    var data = SMS_REGEX.POWER.exec(body);
    $scope.guardContent.power = data[1].indexOf("восстановление") >= 0;
    $scope.saveData('guardContent');
  }
  $scope.errorModule = function() {
    $scope.potContent.errorModule = true;
    $scope.saveData('potContent');
  }

  $scope.potMessages = function(body) {
    var data = SMS_REGEX.POT_MESSAGES.exec(body);
    console.log (data[1])
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
    $scope.saveData('potContent');
  }

  $scope.receiveSMS = function(sms){
    $scope.lastSMS = JSON.stringify(sms);
    $scope.lastIdSms = sms._id;
    $scope.getLastSmsTime();

    var body = sms.body;
    switch(true){
      case SMS_REGEX.REPORT_GUARD.test(body): $scope.reportGuard(body); break;
      case SMS_REGEX.REPORT_MODULE.test(body): $scope.reportModule(body); break;
      case SMS_REGEX.CHANGE_GUARD.test(body): $scope.changeGuard(body); break;
      case SMS_REGEX.SATURN_ALARM.test(body): $scope.saturnAlarm(body); break;
      case SMS_REGEX.MODULE_ALARM.test(body): $scope.moduleAlarm(body); break;
      case SMS_REGEX.POWER.test(body): $scope.saturnPower(body); break;
      case SMS_REGEX.POT_MESSAGES.test(body): $scope.potMessages(body); break;
      case SMS_REGEX.ERROR_MODULE.test(body): $scope.errorModule(); break;
      default: console.warn("Undefined sms received: ", body);
    }
    $state.go($state.current, {}, {reload: true});
  }

  $scope.getFileAccess = function() {
    $cordovaFile.createDir(cordova.file.applicationStorageDirectory, "new_dir", false)
      .then(function (success) {
        $scope.lasterror = "success createDir";
        // success
      }, function (error) {
        $scope.lasterror = "error createDir";
      });
      $scope.lasterror = "OK acccess";
  }

  $scope.errorFileAccess = function() {
      $scope.lasterror = "NOT acccess";
  }

  $scope.initSMS = function() {

    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $scope.getFileAccess, $scope.errorFileAccess);


    if(!$scope.sms.init) {
      $scope.startModal(30000, "Загрузка данных");
      SMS.sendSMS($scope.phones.pot, COMMANDS.REPORT, $scope.finishModal, $scope.errorModal());
    }

    $interval (function(){
      var filter = {
        box : 'inbox',
        read : 0,
        address : $scope.phones.pot,
      };

      if(window.SMS) SMS.listSMS(filter, function(data){
        $scope.timesee = data[0].date;
        if(Array.isArray(data)) {
          _.forOwnRight(data, function(value, key) {
            $scope.objects.items.forEach(function(obj){
              if ((data[key].address == obj.number)  && (data[key]._id > $scope.lastIdSms))
                if (obj.id == $scope.currentPot().id)
                    $scope.receiveSMS(data[key]);
                else{
                  $scope.lastObjId = $scope.potNumber;
                  $scope.saveAllData();
                  $scope.potNumber = obj.id;
                  $scope.loadAllData();
                  $scope.receiveSMS(data[key]);
                  $scope.saveAllData();
                  $scope.smsOtherObj($scope.currentPot().label)
                }
            });

          });
        }
      }, function(err) { $scope.startModal(null, "Не могу прочитать SMS", true) });

    }, READ_INTERVAL)
  };

  $scope.loadAllData();

  document.addEventListener('deviceready', $scope.initSMS, false);

  $scope.getLabelFromId = function(inId){
      return (_.find($scope.objects.items, {id: inId}).label);
  }
  $scope.getIdFromLabel = function(lab){
      return (_.find($scope.objects.items, {label: lab}).id);
  }


$scope.getItemLabel = function(currentId){
        return $scope.getLabelFromId(currentId);
}

$scope.getObjColor = function(id){
    if (id==$scope.potNumber) return "calm";
    else return "light";
}

$scope.smsOtherObj = function(lab){

  var seeObj = $ionicPopup.show({
    // template: '<button  ng-click="chooseObjects(item.id);" class="button button-block item-icon-right" ng-repeat="item in objects.items">{{getItemLabel(item.id)}}</button>',
    title: 'Активность',
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
      template: '<button  ng-click="chooseObjects(item.id);" class="button button-block button-{{getObjColor(item.id)}} item-icon-right" ng-repeat="item in objects.items">{{getItemLabel(item.id)}}</button>',
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
      $scope.potNumber = id;
      $scope.loadAllData();
      seeObjects.close();
      $state.go($state.current, {}, {reload: true});
    }

    $scope.objectEditor = function(){
      seeObjects.close();
      $state.go("app.objectEditor");
    }
  };

  $scope.checkOptionPass = function() {
    $scope.data = {
      password: 111
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

      if ($scope.data.password == "111") {
        $state.go("app.option.index");
      } else {

        var  error = $ionicPopup.show({
          title: 'Код доступа неверный',
          buttons: [ { text: 'OK', type: 'button-assertive' } ]
        });

      }

    });
  };
  $scope.timeConverter = function (UNIX_timestamp){
    var a = new Date(UNIX_timestamp*1000);
    var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  $scope.data1 = [
    // {body : " запуск снят с охраны вх:+--+- вых:00000 220в "},
    // {body : "79021201364 снят с охраны"},
    // {body : "тревога 3: тратратра"},
    // {body : "восстановление 220в"},
    // {body : "восстановление 3: 220в"},
    {body : "вер:3.1 запуск кот:101 вх:00110000 вых:10"},
    // {body: "перегрев теплоносителя 2: котел 3"},
    // {body: "отказ дополнительного модуля"}

  ],

  $scope.checkBalance = function(){
      $scope.receiveSMS($scope.data1[0]);

    console.log($scope.timeConverter(14327324533))
    // if ($scope.phones.balance != ""){
    //   $scope.startModal(5000);
    //   if(window.SMS) SMS.sendSMS($scope.phones.pot,COMMANDS.CHECK_BALANCE($scope.phones.balance), function(){
    //     $scope.completeModal();
    //   }, $scope.errorModal());
    // } else {
    //   var  error = $ionicPopup.show({
    //     title: 'Ошибка',
    //     subTitle: 'Номер проверки баланса не настроен',
    //     buttons: [ { text: 'OK', type: 'button-assertive' } ]
    //   });
    // }
  }
  $scope.toggleSendError = function(){
    return false;
  }
  $scope.toggleSendSuccesful = function(){
    return false;
  }

  $scope.getCurrentTime = function(){
      var currentTime = new Date()/1000;
      return $scope.timeConverter(currentTime);
  }

  $scope.getLastSmsTime = function(){
      $scope.lastSmsTime = $scope.getCurrentTime();
      $scope.saveData('lastSmsTime');
  }

$scope.playMusic = function(src){
      var src1 = "/src/audio.mp3";
      var media = new Media(src, null, null, mediaStatusCallback);
      media.play();
    };
})
