angular.module('starter.controllers')

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

       }, $scope.errorModal());

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
      if ($scope.selected.id == -1 ){
        $scope.setPotNumber($scope.phoneNumber);
      }
      if ($scope.selected.id == -2 ) $scope.setBalanceNumber($scope.phoneNumber);
  }else
      $scope.updateNumber($scope.selected.id, $scope.phoneNumber);
    }

    $scope.resetForm();
})

.controller('inputsController', function($scope){
  $scope.numberInput = [
    { id: 1, label: 'Сатурн 1'},
    { id: 2, label: 'Сатурн 2'},
    { id: 3,  label: 'Сатурн 3'},
    { id: 4,  label: 'Сатурн 4' },
    { id: 5,  label: 'Сатурн 5' },
    { id: 11,  label: 'Модуль 1' },
    { id: 12,  label: 'Модуль 2' },
    { id: 13,  label: 'Модуль 3' },
    { id: 14,  label: 'Модуль 4' },
    { id: 15,  label: 'Модуль 5' },
    { id: 16,  label: 'Модуль 6' },
    { id: 17,  label: 'Модуль 7' },
    { id: 18,  label: 'Модуль 8' },
  ];

  $scope.minVoltage = [
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3, label: '3'},
    { id: 4, label: '4'},
    { id: 5, label: '5'},
    { id: 6, label: '6'},
    { id: 7, label: '7'},
    { id: 8, label: '8'},
    { id: 9, label: '9'}
  ];
  $scope.maxVoltage = [
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3, label: '3'},
    { id: 4, label: '4'},
    { id: 5, label: '5'},
    { id: 6, label: '6'},
    { id: 7, label: '7'},
    { id: 8, label: '8'},
    { id: 9, label: '9'}
  ];
  $scope.minTime = [
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3, label: '3'},
    { id: 4, label: '4'},
    { id: 5, label: '5'},
    { id: 6, label: '6'},
    { id: 7, label: '7'},
    { id: 8, label: '8'},
    { id: 9, label: '9'}
  ];
  $scope.inactiveTime = [
    { id: 1, label: '10'},
    { id: 2, label: '20'},
    { id: 3, label: '30'},
    { id: 4, label: '40'},
    { id: 5, label: '50'},
    { id: 6, label: '60'},
    { id: 7, label: '70'},
    { id: 8, label: '80'},
    { id: 9, label: '90'}
  ];
  $scope.waitTime = [
    { id: 0, label: '0'},
    { id: 1, label: '15'},
    { id: 2, label: '30'},
    { id: 3, label: '45'},
    { id: 4, label: '60'},
    { id: 5, label: '75'},
    { id: 6, label: '90'},
    { id: 7, label: '105'},
    { id: 8, label: '120'},
    { id: 9, label: '135'}
  ];

  $scope.modeInput = [
    { id: 0, label: 'Контроль только на охране'},
    { id: 1, label: 'Постоянный контроль'},
    { id: 2, label: 'Контроль на охране, инверсный вход'},
    { id: 3, label: 'Постоянный контроль, инверсный вход'},
    { id: 4, label: '"Тихая тревога"'},
  ];
  $scope.outInput = [
    { id: 0, label: '0'},
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3, label: '3'},
    { id: 4, label: '4'},
  ];

  $scope.waitTimeModule = [
    { id: 0, label: '0'},
    { id: 1, label: '5'},
    { id: 2, label: '10'},
    { id: 3, label: '15'},
    { id: 4, label: '20'},
    { id: 5, label: '25'},
    { id: 6, label: '30'},
    { id: 7, label: '35'},
    { id: 8, label: '40'},
    { id: 9, label: '45'}
  ];

  $scope.inactiveTimeModule = [
    { id: 0, label: '0'},
    { id: 1, label: '5'},
    { id: 2, label: '10'},
    { id: 3, label: '15'},
    { id: 4, label: '20'},
    { id: 5, label: '25'},
    { id: 6, label: '30'},
    { id: 7, label: '35'},
    { id: 8, label: '40'},
    { id: 9, label: '45'}
  ];

  $scope.outInputModule = [
    { id: 0, label: '0'},
    { id: 1, label: '1'},
    { id: 2, label: '2'},
  ];
  $scope.minTimeModule = [
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3, label: '3'},
    { id: 4, label: '4'},
    { id: 5, label: '5'},
    { id: 6, label: '6'},
    { id: 7, label: '7'},
    { id: 8, label: '8'},
    { id: 9, label: '9'}
  ];



  $scope.numberInputselected = $scope.numberInput[0];
  $scope.minVoltageselected = $scope.minVoltage[$scope.vsOptions.minVoltage[$scope.numberInputselected.id-1]];
  $scope.maxVoltageselected = $scope.maxVoltage[$scope.vsOptions.maxVoltage[$scope.numberInputselected.id-1]];
  $scope.minTimeselected = $scope.minTime[$scope.vsOptions.minTime[$scope.numberInputselected.id-1]];
  $scope.inactiveTimeselected = $scope.inactiveTime[$scope.vsOptions.inactiveTime[$scope.numberInputselected.id-1]];
  $scope.waitTimeselected = $scope.waitTime[$scope.vsOptions.waitTime[$scope.numberInputselected.id-1]];
  $scope.modeInputselected = $scope.modeInput[$scope.vsOptions.modeInput[$scope.numberInputselected.id-1]];
  $scope.outInputselected = $scope.outInput[$scope.vsOptions.outInput[$scope.numberInputselected.id-1]];

  $scope.getNowInput = function(){
    return parseInt($scope.numberInputselected.id);
  };

  $scope.setVsOptions = function(){
    if ($scope.numberInputselected.id<10){
       $scope.startModal(5000);
        if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_VSOPTION($scope.numberInputselected.id,$scope.minVoltageselected.id,
          $scope.maxVoltageselected.id,$scope.minTimeselected.id,$scope.inactiveTimeselected.id,$scope.waitTimeselected.id,
          $scope.modeInputselected.id,$scope.outInputselected.id), function(){
          $scope.vsOptions.minVoltage[$scope.numberInputselected.id-1] = $scope.minVoltageselected.id-1;
          $scope.vsOptions.maxVoltage[$scope.numberInputselected.id-1] = $scope.maxVoltageselected.id-1;
          $scope.vsOptions.minTime[$scope.numberInputselected.id-1] = $scope.minTimeselected.id-1;
          $scope.vsOptions.inactiveTime[$scope.numberInputselected.id-1] = $scope.inactiveTimeselected.id-1;
          $scope.vsOptions.waitTime[$scope.numberInputselected.id-1] = $scope.waitTimeselected.id;
          $scope.vsOptions.modeInput[$scope.numberInputselected.id-1] = $scope.modeInputselected.id;
          $scope.vsOptions.outInput[$scope.numberInputselected.id-1] = $scope.outInputselected.id;
          $scope.saveData('vsOptions');
          $scope.completeModal();

        }, $scope.errorModal());
    }else{
       if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_VMOPTION($scope.numberInputselected.id,$scope.minTimeModuleselected.id,
         $scope.inactiveTimeModuleselected.id,$scope.waitTimeModuleselected.id,$scope.outInputOnModuleselected.id,$scope.outInputOffModuleselected.id),
          function(){
           $scope.vsOptions.minTimeModule[$scope.numberInputselected.id-11] = $scope.minTimeModuleselected.id-1;
           $scope.vsOptions.inactiveTimeModule[$scope.numberInputselected.id-11] = $scope.inactiveTimeModuleselected.id;
           $scope.vsOptions.waitTimeModule[$scope.numberInputselected.id-11] = $scope.waitTimeModuleselected.id;
           $scope.vsOptions.outInputOnModule[$scope.numberInputselected.id-11] = $scope.outInputOnModuleselected.id;
           $scope.vsOptions.outInputOffModule[$scope.numberInputselected.id-11] = $scope.outInputOffModuleselected.id;
         $scope.saveData('vsOptions');
         $scope.completeModal();

       }, $scope.errorModal());
    }
  }
    $scope.resetForm = function() {
      if ($scope.numberInputselected.id<10){
        $scope.minVoltageselected = $scope.minVoltage[$scope.vsOptions.minVoltage[$scope.numberInputselected.id-1]];
        $scope.maxVoltageselected = $scope.maxVoltage[$scope.vsOptions.maxVoltage[$scope.numberInputselected.id-1]];
        $scope.minTimeselected = $scope.minTime[$scope.vsOptions.minTime[$scope.numberInputselected.id-1]];
        $scope.inactiveTimeselected = $scope.inactiveTime[$scope.vsOptions.inactiveTime[$scope.numberInputselected.id-1]];
        $scope.waitTimeselected = $scope.waitTime[$scope.vsOptions.waitTime[$scope.numberInputselected.id-1]];
        $scope.modeInputselected = $scope.modeInput[$scope.vsOptions.modeInput[$scope.numberInputselected.id-1]];
        $scope.outInputselected = $scope.outInput[$scope.vsOptions.outInput[$scope.numberInputselected.id-1]];
      }else{
        $scope.minTimeModuleselected = $scope.minTimeModule[$scope.vsOptions.minTimeModule[$scope.numberInputselected.id-11]];
        $scope.inactiveTimeModuleselected = $scope.inactiveTimeModule[$scope.vsOptions.inactiveTimeModule[$scope.numberInputselected.id-11]];
        $scope.waitTimeModuleselected = $scope.waitTimeModule[$scope.vsOptions.waitTimeModule[$scope.numberInputselected.id-11]];
        $scope.outInputOnModuleselected = $scope.outInputModule[$scope.vsOptions.outInputOnModule[$scope.numberInputselected.id-11]];
        $scope.outInputOffModuleselected = $scope.outInputModule[$scope.vsOptions.outInputOffModule[$scope.numberInputselected.id-11]];
      }
    }

})

.controller('outputsController', function($scope){
  $scope.modeOutput = [
    { id: 0, label: 'Ручное управление'},
    { id: 1, label: 'Сирена'},
    { id: 2, label: 'Маяк'},
    { id: 3, label: 'Автоматика'},
  ];

  $scope.outputSelected = [
    $scope.modeOutput[$scope.nrOptions.modeOutput[0]],$scope.modeOutput[$scope.nrOptions.modeOutput[1]],
    $scope.modeOutput[$scope.nrOptions.modeOutput[2]],$scope.modeOutput[$scope.nrOptions.modeOutput[3]]
  ];
  $scope.outputComment = [
    $scope.nrOptions.guardOutput[0],$scope.nrOptions.guardOutput[1],
    $scope.nrOptions.guardOutput[2],$scope.nrOptions.guardOutput[3],
    $scope.nrOptions.moduleOutput[0],$scope.nrOptions.moduleOutput[1],
]

  $scope.setNrOptions = function(){
    $scope.startModal(5000);
    if (($scope.nrOptions.modeOutput[0] != $scope.outputSelected[0].id) || ($scope.nrOptions.modeOutput[1] != $scope.outputSelected[1].id) ||
    ($scope.nrOptions.modeOutput[2] != $scope.outputSelected[2].id) || ($scope.nrOptions.modeOutput[3] != $scope.outputSelected[3].id)){
    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_NROPTION($scope.outputSelected[0].id,$scope.outputSelected[1].id,
      $scope.outputSelected[2].id,$scope.outputSelected[3].id), function(){
          $scope.nrOptions.modeOutput[0] = $scope.outputSelected[0].id;
          $scope.nrOptions.modeOutput[1] = $scope.outputSelected[1].id;
          $scope.nrOptions.modeOutput[2] = $scope.outputSelected[2].id;
          $scope.nrOptions.modeOutput[3] = $scope.outputSelected[3].id;
          $scope.saveData('nrOptions');
          $scope.completeModal();
           }, $scope.errorModal());
    }else{$scope.completeModal()}
        $scope.nrOptions.guardOutput[0] = $scope.outputComment[0];
        $scope.nrOptions.guardOutput[1] = $scope.outputComment[1];
        $scope.nrOptions.guardOutput[2] = $scope.outputComment[2];
        $scope.nrOptions.guardOutput[3] = $scope.outputComment[3];
        $scope.nrOptions.moduleOutput[0] = $scope.outputComment[4];
        $scope.nrOptions.moduleOutput[1] = $scope.outputComment[5];
        $scope.saveData('nrOptions');
  }
})

.controller('messagesController', function($scope){
  $scope.textInputsOptions = [
    { id: 1, label: 'Сатурн 1'},
    { id: 2, label: 'Сатурн 2'},
    { id: 3,  label: 'Сатурн 3'},
    { id: 4,  label: 'Сатурн 4' },
    { id: 5,  label: 'Сатурн 5' },
    { id: 11,  label: 'Модуль 1' },
    { id: 12,  label: 'Модуль 2' },
    { id: 13,  label: 'Модуль 3' },
    { id: 14,  label: 'Модуль 4' },
    { id: 15,  label: 'Модуль 5' },
    { id: 16,  label: 'Модуль 6' },
    { id: 17,  label: 'Модуль 7' },
    { id: 18,  label: 'Модуль 8' },
  ];

  $scope.selected = $scope.textInputsOptions[0];

  $scope.getTextLong = function() {
      if ($scope.selected.id > 10) return 40
      else return 15
  }
  $scope.resetForm = function() {
     if ($scope.selected.id < 10){
       $scope.textInput = $scope.ssOptions.text[$scope.selected.id-1];
     }else
     $scope.textInput = $scope.ssOptions.text[$scope.selected.id-6];
  }

  $scope.setText = function(){
   if ($scope.selected.id < 10 ){

     $scope.updateText($scope.selected.id,$scope.textInput);

   }else
     $scope.updateText($scope.selected.id-5,$scope.textInput);
  }
  $scope.resetForm();
})

.controller('termoController', function($scope, $ionicPopup){
  $scope.termoOptions = [
    { id: 0, label: 'Сообщение'},
    { id: 1, label: 'Выход 1'},
    { id: 2, label: 'Выход 2'},
    { id: 3,  label: 'Выход 3'},
    { id: 4,  label: 'Выход 4' },
    { id: 5,  label: 'Горелка 1' },
    { id: 6,  label: 'Горелка 2' },
    { id: 7,  label: 'Горелка 3' },
    { id: 8, label: 'доп.Выход 1'},
    { id: 9, label: 'доп.Выход 2'},
  ];
  $scope.termNumberOptions = [
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3,  label: '3'},
    { id: 4,  label: '4' },
    { id: 5,  label: '5' },
  ];

  $scope.numberSelected = $scope.termNumberOptions[$scope.temperature.lastUse];
  $scope.minTemp = $scope.temperature.minOut[$scope.numberSelected.id-1];
  $scope.maxTemp = $scope.temperature.maxOut[$scope.numberSelected.id-1];
  $scope.selected = $scope.termoOptions[$scope.temperature.optionNow[$scope.numberSelected.id-1]];
  $scope.comments = $scope.temperature.comment[$scope.numberSelected.id-1];

  // $scope.getOptionNow = function(){
  //   return $scope.termoOptions[1].label
  // }
  $scope.resetForm = function() {
    $scope.minTemp = $scope.temperature.minOut[$scope.numberSelected.id-1];
    $scope.maxTemp = $scope.temperature.maxOut[$scope.numberSelected.id-1];
    $scope.selected = $scope.termoOptions[$scope.temperature.optionNow[$scope.numberSelected.id-1]];
    $scope.comments = $scope.temperature.comment[$scope.numberSelected.id-1];
  }

  $scope.resetForm2 = function() {
     if (($scope.selected.id) == 0){
      $scope.minTemp = $scope.temperature.minText[$scope.numberSelected.id-1];
      $scope.maxTemp = $scope.temperature.maxText[$scope.numberSelected.id-1];
    }else{
      $scope.minTemp = $scope.temperature.minOut[$scope.numberSelected.id-1];
      $scope.maxTemp = $scope.temperature.maxOut[$scope.numberSelected.id-1];
    }
  }

  $scope.getMinTemp = function(){
    if ($scope.minTemp>0) return '+' + $scope.minTemp;
    else return  $scope.minTemp;
  }
  $scope.getMaxTemp = function(){
    if ($scope.maxTemp>0) return '+' + $scope.maxTemp;
    else return $scope.maxTemp;
  }

  $scope.minusMinTemp = function(){
    if ($scope.minTemp>-99) $scope.minTemp = $scope.minTemp - 1;
  }
  $scope.plusMinTemp = function(){
    if ($scope.minTemp<99) $scope.minTemp = $scope.minTemp + 1;
  }
  $scope.minusMaxTemp = function(){
    if ($scope.maxTemp>-99) $scope.maxTemp = $scope.maxTemp - 1;
  }
  $scope.plusMaxTemp = function(){
    if ($scope.maxTemp<99) $scope.maxTemp = $scope.maxTemp + 1;
  }
  $scope.clickMin = function(){
    $scope.rangeTemp = $scope.minTemp;
    $scope.whatTemp = "min";
    $scope.startTempModal("Минимальная");
  }
  $scope.clickMax = function(){
    $scope.rangeTemp = $scope.maxTemp;
    $scope.whatTemp = "max";
    $scope.startTempModal("Максимальная");
  }

  $scope.startTempModal = function(label) {

    $scope.modal = $ionicPopup.show({
      templateUrl: 'templates/options/modalTemp.html',
      title: label,
      scope: $scope,
    });
  }

  $scope.finishTempModal = function(label) {
    if(!$scope.modal) return;
    $scope.modal.close();
    return parseInt($scope.rangeTemp);
  }

  $scope.getTemp = function(){
    if ($scope.rangeTemp>0) return '+' + $scope.rangeTemp;
    return $scope.rangeTemp;
  }

  $scope.getWhatTemp = function(){
    return $scope.whatTemp;
  }

  $scope.setTemperature = function(){
    if ($scope.selected.id == 0){
      $scope.startModal(5000);
      if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_TEMPTEXT($scope.numberSelected.id,
      $scope.getMinTemp(),$scope.getMaxTemp()), function(){
            $scope.temperature.minText[$scope.numberSelected.id-1] = $scope.minTemp;
            $scope.temperature.maxText[$scope.numberSelected.id-1] = $scope.maxTemp;
            $scope.saveData('temperature');
            $scope.completeModal();
      }, $scope.errorModal());
      // console.log(COMMANDS.SET_TEMPTEXT($scope.numberSelected.id,$scope.getMinTemp(),$scope.getMaxTemp()));
    }else{
      $scope.startModal(5000);
      if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_TEMPOUT($scope.numberSelected.id,$scope.selected.id,
      $scope.getMinTemp(),$scope.getMaxTemp()), function(){
            $scope.temperature.minOut[$scope.numberSelected.id-1] = $scope.minTemp;
            $scope.temperature.maxOut[$scope.numberSelected.id-1] = $scope.maxTemp;
            $scope.temperature.optionNow[$scope.numberSelected.id-1] = $scope.selected.id;
            $scope.temperature.comment[$scope.numberSelected.id-1] = $scope.comments;
            $scope.saveData('temperature');
            $scope.completeModal();
      }, $scope.errorModal());
      console.log(COMMANDS.SET_TEMPOUT($scope.numberSelected.id,$scope.selected.id,$scope.getMinTemp(),$scope.getMaxTemp()));

    }
  }
})

.controller('accessController', function($scope){
  $scope.numberAccess = [
    { id: 0, label: 'Отключить'},
    { id: 1, label: 'Оповещение: по 1 входу'},
    { id: 2, label: 'по 2 входу'},
    { id: 3, label: 'по 3 входу'},
    { id: 4, label: 'по 4 входу'},
    { id: 5, label: 'по 5 входу'},
    { id: 6, label: 'о режиме охраны'},
    { id: 7, label: 'о тревогах'},
    { id: 8, label: 'дублирование всех смс'},
    { id: 9, label: 'Хозяин'},
  ];

  $scope.access1Selected = $scope.numberAccess[$scope.ndOptions.numberAccess[0]];
  $scope.access2Selected = $scope.numberAccess[$scope.ndOptions.numberAccess[1]];
  $scope.access3Selected = $scope.numberAccess[$scope.ndOptions.numberAccess[2]];
  $scope.access4Selected = $scope.numberAccess[$scope.ndOptions.numberAccess[3]];

  $scope.setNdOptions = function(){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_NDOPTION($scope.access1Selected.id,$scope.access2Selected.id,
      $scope.access3Selected.id,$scope.access4Selected.id), function(){
          $scope.ndOptions.numberAccess[0] = $scope.access1Selected.id;
          $scope.ndOptions.numberAccess[1] = $scope.access2Selected.id;
          $scope.ndOptions.numberAccess[2] = $scope.access3Selected.id;
          $scope.ndOptions.numberAccess[3] = $scope.access4Selected.id;
          $scope.saveData('ndOptions');
          $scope.completeModal();
           }, $scope.errorModal());
  }
})

.controller('addController', function($scope, $localstorage){

  $scope.handDel = function(what){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot,COMMANDS.DEL_TMTERM(what), function(){
          $scope.completeModal();
    }, $scope.errorModal());
  }

  $scope.resetDevice = function(){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot,COMMANDS.RESET_DEVICE(), function(){
          $scope.completeModal();
    }, $scope.errorModal());
  }


})
