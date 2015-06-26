angular.module('starter.controllers')

.controller('guardController', function($scope, $state, $ionicPopup, $location) {

  $scope.statToggle = {
    checked: $scope.guardContent.stateGuard
  }

  $scope.getErrorModule = function(){
    return $scope.potContent.errorModule;
  }

  $scope.tempId = function() {
    return $state.params.tempId;
   }

   $scope.toggleGuardSuccesful = function(){
     $scope.guardContent.stateGuard = $scope.statToggle.checked;
     $scope.saveData('guardContent');
     $scope.guardContent.statusGuard = 2;
     $scope.toggleSendSuccesful();
   }

   $scope.statToggleChange = function(){
    //  console.log(COMMANDS.SET_GUARD($scope.statToggle.checked));
    //  $scope.startModal(1000);
      if ($scope.guardContent.statusGuard == 2){
          var playAlarm = $ionicPopup.show({
            template: 'Изменить состояние?',
            title: 'Объект не получил ответ',
            scope: $scope,
            buttons: [
              {
                text: '<b>Изменить</b>',
                type: 'button-positive',
                onTap: function(e) {
                  $scope.sendSmsMessage(COMMANDS.SET_GUARD($scope.statToggle.checked),$scope.toggleGuardSuccesful,$scope.toggleSendError)
                }
              },{
                text: '<b>Повторить</b>',
                type: 'button-positive',
                onTap: function(e) {
                  $scope.sendSmsMessage(COMMANDS.SET_GUARD(!$scope.statToggle.checked),$scope.toggleGuardSuccesful,$scope.toggleSendError)
                  $scope.statToggle.checked = !$scope.statToggle.checked;
                }
              }
            ]
          });
        }else{
              $scope.sendSmsMessage(COMMANDS.SET_GUARD($scope.statToggle.checked),$scope.toggleGuardSuccesful,$scope.toggleSendError)
        }

   }

   $scope.getGuardState = function(){
     return GUARD_STATES[$scope.guardContent.statusGuard];
   }

   $scope.getGuardStateText = function(){
     return $scope.getGuardState().text;
   }

   $scope.getGuardColor = function(){
     return $scope.getGuardState().color;
     }

   $scope.getGuardPower = function(){
     return $scope.guardContent.power;
     }

   $scope.getInputColor = function(number){
      return $scope.setColors($scope.guardContent.inputs[number])
     }
   $scope.getOutputColor = function(number){
     return $scope.setOutputColors($scope.guardContent.outputs[number])
     }


   $scope.seeOutputComment = function(id) {
        $scope.data = {
          idOutput: id-1,
          comment: $scope.ssOptions.guardOutput[id-1],
        }

        // An elaborate, custom popup
        var outputComment = $ionicPopup.show({
          template: '<input type="text" placeholder="Ваш комментарий" ng-model="data.comment">',
          title: 'Выход '+ id,
          scope: $scope,
          buttons: [
            {
              text: '<b>Принять</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.comment) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data;
                }
              }
            }
          ]
        });
        outputComment.then(function(data) {
          $scope.ssOptions.guardOutput[data.idOutput] = data.comment;
          $scope.saveData('ssOptions');
        });
   };

   $scope.seePotGet = function(num){
     return $scope.potContent.seePot[num];
   }

   $scope.seeInputComment = function(id) {
        $scope.data = {
          idInput: id-1,
          comment: $scope.ssOptions.text[id-1],
        }

        // An elaborate, custom popup
        var inputComment = $ionicPopup.show({
          template: '<input type="text" placeholder="Ваш комментарий" ng-model="data.comment" Disabled>',
          title: 'Вход '+ id,
          scope: $scope,
          buttons: [
            {
              text: '<b>Принять</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.comment) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data;
                }
              }
            }
          ]
        });
        inputComment.then(function(data) {
          // $scope.ssOption.text[data.idOutput] = data.comment;
          // $scope.saveData('ssOption');
          // console.log('Tapped!', data.comment);
        });
   };

   $scope.seeTempComment = function(id) {
        $scope.data = {
          idTemp: id-1,
          comment: $scope.temperature.comment[id-1],
        }

        // An elaborate, custom popup
        var tempComment = $ionicPopup.show({
          template: '<input type="text" placeholder="Ваш комментарий" ng-model="data.comment">',
          title: 'Датчик '+ id,
          scope: $scope,
          buttons: [
            {text: 'Настройка',
            type: 'button-stable',
            onTap: function() {
              $scope.data.comment = '';
            }},
            {
              text: '<b>Принять</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.comment) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data;
                }
              }
            }
          ]
        });

            tempComment.then(function(data) {
              if ($scope.data.comment != ''){
                $scope.temperature.comment[data.idTemp] = data.comment;
                $scope.saveData('temperature');
                // console.log('Tapped!', data.comment);
              }else{
                $scope.temperature.lastUse = $scope.data.idTemp;
                $state.go("app.option.nt");
              }
            });
      };

    $scope.getNowTemp = function(id){
      return parseInt($scope.temperature.nowTemp[id-1]);
    }
    $scope.getNowTempStr = function(id){
      return $scope.temperature.nowTemp[id-1];
    }

    $scope.getTempColor = function(id){
      if (($scope.getNowTemp(id)>$scope.temperature.maxOut[id-1]) || ($scope.getNowTemp(id)<$scope.temperature.minOut[id-1])){
        return "assertive";
      }else{
            if (($scope.getNowTemp(id)>$scope.temperature.maxText[id-1]) || ($scope.getNowTemp(id)<$scope.temperature.minText[id-1])){
              return "calm";
            }else{
              return "balanced";
            }
      }
    }

    $scope.receiveReport = function(){
      $scope.sendSmsMessage(COMMANDS.REPORT,$scope.toggleSendSuccesful,$scope.toggleSendError)
    }
    $scope.getColorOption = function(lab){
      // return GUARD_STATES[$scope.optionContent].color;
    }

})
