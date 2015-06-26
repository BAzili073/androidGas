angular.module('starter.controllers')

.controller('gaspotController', function($scope, $state, POT_STATES, $ionicPopup) {
  TAB_ACTIVE = 2;
   $scope.statToggle = {
     checked: [$scope.potContent.statToggle[0],$scope.potContent.statToggle[1],$scope.potContent.statToggle[2]]
   }

  $scope.potId = function() {
    return parseInt($state.params.potId);
   }



   $scope.togglePotSuccesful = function(num){
       $scope.potContent.statToggle[num] = $scope.statToggle.checked[num];
       $scope.saveData('potContent');
       $scope.potContent.potState[num] = 9;
       $scope.toggleSendSuccesful();
   }

    $scope.statToggleChange = function(id){
      var num = id - 1;
      var data = num;
      if ($scope.potContent.potState[num] == 9){
          var playAlarm = $ionicPopup.show({
            template: 'Изменить состояние?',
            title: 'Объект не получил ответ',
            scope: $scope,
            buttons: [
              {
                text: '<b>Изменить</b>',
                type: 'button-positive',
                onTap: function(e) {
                  $scope.sendSmsMessage(COMMANDS.CONTROL_POT($scope.statToggle.checked[num],id),$scope.togglePotSuccesful,$scope.toggleSendError,data)
                }
              },{
                text: '<b>Повторить</b>',
                type: 'button-positive',
                onTap: function(e) {
                  $scope.sendSmsMessage(COMMANDS.CONTROL_POT(!$scope.statToggle.checked[num],id),$scope.togglePotSuccesful,$scope.toggleSendError,data)
                  $scope.statToggle.checked[num] = !$scope.statToggle.checked[num]
                }
              }
            ]
          });
        }else{
          $scope.sendSmsMessage(COMMANDS.CONTROL_POT($scope.statToggle.checked[num],id),$scope.togglePotSuccesful,$scope.toggleSendError,data)
        }
    }



    $scope.torchToggleChange = function(id){
      $scope.potContent.torchToggle[id-1] = $scope.torchToggle.checked[id-1];
      $scope.saveData('potContent');
    }

    $scope.getPotState = function(id){
      return POT_STATES[$scope.potContent.potState[id-1]] || {};
    }

    $scope.getPotStateText = function(id){
      return $scope.getPotState(id).text;
    }

    $scope.getPotColor = function(id){
      return $scope.getPotState(id).color;
    }
    $scope.getNowTempStr = function(id){
      return $scope.temperature.nowTemp[id-1];
    }

    $scope.getMinTempStr = function(id){
      if ($scope.temperature.minOut[id-1]>0) return '+' + $scope.temperature.minOut[id-1];
      else return  $scope.temperature.minOut[id-1];
    }
    $scope.getMaxTempStr = function(id){
      if ($scope.temperature.maxOut[id-1]>0) return '+' + $scope.temperature.maxOut[id-1];
      else return  $scope.temperature.maxOut[id-1];
    }

    $scope.torchTemp = function(id){
        return (parseInt($scope.temperature.optionNow.indexOf(id+4))+1);
    }

    $scope.getNowTemp = function(id){
      return parseInt($scope.temperature.nowTemp[id-1]);
    }

    $scope.getTempComment = function(id){
      return $scope.temperature.comment[id];
    }

    $scope.goToTermOption = function(id){
      $scope.changeLastUse(id-1);
      $state.go("app.option.nt");
    }

    // $scope.getTempColor = function(id){
    //   if (($scope.getNowTemp(id)>$scope.temperature.maxOut[id-1]) || ($scope.getNowTemp(id)<$scope.temperature.minOut[id-1])){
    //     return "assertive";
    //   }else{
    //         if (($scope.getNowTemp(id)>$scope.temperature.maxText[id-1]) || ($scope.getNowTemp(id)<$scope.temperature.minText[id-1])){
    //           return "calm";
    //         }else{
    //           return "balanced";
    //         }
    //   }
    // }

})
