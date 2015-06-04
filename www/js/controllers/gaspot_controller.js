angular.module('starter.controllers')

.controller('gaspotController', function($scope, $state, POT_STATES, $ionicPopup) {
  TAB_ACTIVE = 2;
   $scope.statToggle = {
     checked: [$scope.potContent.statToggle[0],$scope.potContent.statToggle[1],$scope.potContent.statToggle[2]]
   }

  $scope.potId = function() {
    return parseInt($state.params.potId);
   }

    $scope.statToggleChange = function(id){
      $scope.startModal(1000);
      var num = id - 1;
      // id = id + 4;
      if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.CONTROL_POT($scope.statToggle.checked[num],id), function(){
        $scope.potContent.statToggle[num] = $scope.statToggle.checked[num];
        $scope.saveData('potContent');
        $scope.potContent.potState[num] = 9;
        $scope.toggleSendSuccesful();
    }, $scope.toggleSendError());
    console.log(COMMANDS.CONTROL_POT($scope.statToggle.checked[num],id));
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
