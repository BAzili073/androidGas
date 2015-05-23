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
  RESET_DEVICE: function(){ return 'ресет';},
  CHECK_BALANCE: function(number){ return 'б ' + number;},
  SET_GUARD: function(state){ return 'о'+ (state ? 1:0);},
  SET_OUTPUT: function(number,state){ return 'в'+number + ' ' + state;},
  SET_TEMPTEXT: function(number,min,max){ return 'т'+number + 'с' +' '+ min + max;},
  SET_TEMPOUT: function(number,output,min,max){ return 'т'+ number + 'в' + output +' '+ min + max;},
};

var SMS_REGEX = {
  REPORT_GUARD: /(?:х )?(?:вер:(\d.\d ))?(?:запуск )?(на охране|снят с охраны)(?: т:((?:-?\d;*)*)?(?: тм=(\d*))?)? ?(?:вх:([+-]*) вых:([01]*) (220в|акк!))/,
  REPORT_MODULE: /(?:вер:\d.\d )?(?:запуск )?кот:(\d{3}) вх:([01]{8}) вых:([10]{2})/,
  CHANGE_GUARD: /(?:(\d{11})|(?:тм=(\d*))) (на охране|снят с охраны)/,
  SATURN_ALARM: /тревога (\d): [а-я]*/,
  MODULE_ALARM: /(сработал|восстановление) (\d): [а-я]*/,
  POWER: /(отказ|восстановление) 220в/
};

var READ_INTERVAL = 1000;

var DATA_VERSION = "0.4.9";

var DEFAULT_DATA = {

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
    potState: [0,0,0],
    inputs: [false,false,false,false,false,false,false,false],
  },

  guardContent:{
    stateGuard: true,//true = on false = off
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
  }

};

var DATA_KEYS = ['phones', 'ssOptions', 'nsOptions', 'vsOptions', 'nrOptions', 'ndOptions', 'temperature', 'potContent', 'guardContent', 'handContent'];

angular.module('starter.controllers', ['starter.services', 'starter.constants', 'starter.directives'])

.controller('AppCtrl', function($scope,$state,$ionicHistory, $window, $interval, $localstorage, $ionicModal, $timeout, $ionicPopup) {
  $scope.post = {url: 'http://', title: ''};
  $scope.sms = {
    init: true
  };

  $localstorage.checkVersion(DATA_VERSION);



  $scope.lastSMS = '';

  $scope.objects = $localstorage.getObject('objects',{
    items : [{id:0,label: "Котельная №1"}],
  });
  $scope.potNumber = $scope.objects.items[0].id;

  // for(var i = 0; i < ($scope.objects.name.length); i++) {
  //   if ($scope.objects.name[i] != "") $scope.objects.items.push({
  //     id : i,
  //     label : $scope.objects.name[i]
  //   })
  //   }

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
    $scope.guardContent.stateGuard = data[2].indexOf("на охране") >= 0;
    $scope.guardContent.statusGuard = (data[2].indexOf("на охране") >= 0) ? 1:0;
    $scope.temperature.nowTemp = data[3].split(";").map(function(i){ if (i>0){ return "+" + i} else {return i}})
    $scope.guardContent.counterTM = data[4]
    $scope.guardContent.inputs = data[5].split("").map(function(i){ return i === "+" });
    $scope.handContent.outputsSaturn = data[6].split("").map(function(i){ return i === "1" });
    $scope.guardContent.power = data[7].indexOf("220") >= 0;
    $scope.saveData('guardContent');
    $scope.saveData('temperature');
    $scope.saveData('handContent');
  }
  $scope.reportModule = function(body) {
    var data = SMS_REGEX.REPORT_MODULE.exec(body);
    $scope.potContent.potState = data[1].split("");
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

  $scope.receiveSMS = function(sms){
    $scope.lastSMS = JSON.stringify(sms);

    var body = sms.body;
    switch(true){
      case SMS_REGEX.REPORT_GUARD.test(body): $scope.reportGuard(body); break;
      case SMS_REGEX.REPORT_MODULE.test(body): $scope.reportModule(body); break;
      case SMS_REGEX.CHANGE_GUARD.test(body): $scope.changeGuard(body); break;
      case SMS_REGEX.SATURN_ALARM.test(body): $scope.saturnAlarm(body); break;
      case SMS_REGEX.MODULE_ALARM.test(body): $scope.moduleAlarm(body); break;
      case SMS_REGEX.POWER.test(body): $scope.saturnPower(body); break;
      default: console.warn("Undefined sms received: ", body);
    }
    $state.go($state.current, {}, {reload: true});
  }

  $scope.initSMS = function() {

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
        if(Array.isArray(data)) {
          for(var i in data) {
            if (data[i].address == $scope.phones.pot)
            $scope.receiveSMS(data[i]);
          }
        }
      }, function(err) { $scope.startModal(null, "Не могу прочитать SMS", true) });

    }, READ_INTERVAL)
  };

  $scope.loadAllData();

  document.addEventListener('deviceready', $scope.initSMS, false);

  $scope.getLabelFromId = function(inId){
      return (_.find($scope.objects.items, {id: inId}).label);
  }

$scope.getItemLabel = function(currentId){
    if (currentId==$scope.potNumber) return (">> " + $scope.getLabelFromId(currentId) + " <<")
    else return $scope.getLabelFromId(currentId);
}

  $scope.showObjects = function(){

    var seeObjects = $ionicPopup.show({
      template: '<button  ng-click="chooseObjects(item.id);" class="button button-block item-icon-right" ng-repeat="item in objects.items">{{getItemLabel(item.id)}}</button>',
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

  $scope.data1 = [
    // {body : " на охране т:50;4;-4 вх:+++++ вых:0100 220в"},
    // {body : "79021201364 снят с охраны"},
    // {body : "тревога 3: тратратра"},
    // {body : "восстановление 220в"},
    {body : "восстановление 3: 220в"},
    // {body : "вер:3.1 запуск кот:102 вх:00110000 вых:10"},

  ],

  $scope.checkBalance = function(){
      $scope.receiveSMS($scope.data1[0]);
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

  $scope.currentPot = function() {
    return _.find($scope.objects.items, {id: $scope.potNumber});
  }
})
