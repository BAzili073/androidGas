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

       }, $scope.errorModal);

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


.controller('inputsController', function($scope){
  $scope.numberInput = [
    { id: 1, label: '1'},
    { id: 2, label: '2'},
    { id: 3, label: '3'},
    { id: 4, label: '4'},
    { id: 5, label: '5'},
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

  $scope.numberInputselected = $scope.numberInput[0];
  $scope.minVoltageselected = $scope.minVoltage[$scope.vsOptions.minVoltage[$scope.numberInputselected.id]];
  $scope.maxVoltageselected = $scope.maxVoltage[$scope.vsOptions.maxVoltage[$scope.numberInputselected.id]];
  $scope.minTimeselected = $scope.minTime[$scope.vsOptions.minTime[$scope.numberInputselected.id]];
  $scope.inactiveTimeselected = $scope.inactiveTime[$scope.vsOptions.inactiveTime[$scope.numberInputselected.id]];
  $scope.waitTimeselected = $scope.waitTime[$scope.vsOptions.waitTime[$scope.numberInputselected.id]];
  $scope.modeInputselected = $scope.modeInput[$scope.vsOptions.modeInput[$scope.numberInputselected.id]];
  $scope.outInputselected = $scope.outInput[$scope.vsOptions.outInput[$scope.numberInputselected.id]];

  $scope.setVsOptions = function(){
      $scope.vsOptions.minVoltage[$scope.numberInputselected.id] = $scope.minVoltageselected.id-1;
      $scope.vsOptions.maxVoltage[$scope.numberInputselected.id] = $scope.maxVoltageselected.id-1;
      $scope.vsOptions.minTime[$scope.numberInputselected.id] = $scope.minTimeselected.id-1;
      $scope.vsOptions.inactiveTime[$scope.numberInputselected.id] = $scope.inactiveTimeselected.id-1;
      $scope.vsOptions.waitTime[$scope.numberInputselected.id] = $scope.waitTimeselected.id;
      $scope.vsOptions.modeInput[$scope.numberInputselected.id] = $scope.modeInputselected.id;
      $scope.vsOptions.outInput[$scope.numberInputselected.id] = $scope.outInputselected.id;
      $scope.saveData('vsOptions');
  }
    $scope.resetForm = function() {
      $scope.minVoltageselected = $scope.minVoltage[$scope.vsOptions.minVoltage[$scope.numberInputselected.id]];
      $scope.maxVoltageselected = $scope.maxVoltage[$scope.vsOptions.maxVoltage[$scope.numberInputselected.id]];
      $scope.minTimeselected = $scope.minTime[$scope.vsOptions.minTime[$scope.numberInputselected.id]];
      $scope.inactiveTimeselected = $scope.inactiveTime[$scope.vsOptions.inactiveTime[$scope.numberInputselected.id]];
      $scope.waitTimeselected = $scope.waitTime[$scope.vsOptions.waitTime[$scope.numberInputselected.id]];
      $scope.modeInputselected = $scope.modeInput[$scope.vsOptions.modeInput[$scope.numberInputselected.id]];
      $scope.outInputselected = $scope.outInput[$scope.vsOptions.outInput[$scope.numberInputselected.id]];
    }

})

.controller('outputsController', function($scope){
  $scope.modeOutput = [
    { id: 0, label: 'Ручное управление'},
    { id: 1, label: 'Сирена'},
    { id: 2, label: 'Маяк'},
    { id: 3, label: 'Автоматика'},
  ];

  $scope.output1Selected = $scope.modeOutput[$scope.nrOptions.modeOutput[0]];
  $scope.output2Selected = $scope.modeOutput[$scope.nrOptions.modeOutput[1]];
  $scope.output3Selected = $scope.modeOutput[$scope.nrOptions.modeOutput[2]];
  $scope.output4Selected = $scope.modeOutput[$scope.nrOptions.modeOutput[3]];

  $scope.setNrOptions = function(){
    $scope.startModal(5000);
    if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_NROPTION($scope.nrOptions.modeOutput[0],$scope.nrOptions.modeOutput[1],
      $scope.nrOptions.modeOutput[2],$scope.nrOptions.modeOutput[3]), function(){
          $scope.nrOptions.modeOutput[0] = $scope.output1Selected.id;
          $scope.nrOptions.modeOutput[1] = $scope.output2Selected.id;
          $scope.nrOptions.modeOutput[2] = $scope.output3Selected.id;
          $scope.nrOptions.modeOutput[3] = $scope.output4Selected.id;
          $scope.saveData('nrOptions');
           }, $scope.errorModal);
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
   if ($scope.selected.id < 10 )
     $scope.updateText($scope.selected.id-1,$scope.textInput);
   else
     $scope.updateText($scope.selected.id-6,$scope.textInput);
  }
  $scope.resetForm();
})
