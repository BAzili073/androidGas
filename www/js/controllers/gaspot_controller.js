angular.module('starter.controllers')

.controller('gaspotController', function($scope, $state, POT_STATES, $ionicPopup) {

   $scope.statToggle = {
     checked: $scope.potContent.statToggle[$state.params.potId-1]
   }

   $scope.torchToggle = {
     checked: $scope.potContent.torchToggle[$state.params.potId-1]
   }

  $scope.potId = function() {
    return parseInt($state.params.potId);
   }

    $scope.statToggleChange = function(){
      $scope.potContent.statToggle[$state.params.potId-1] = $scope.statToggle.checked;
      $scope.saveData('potContent');
      $scope.potContent.potState[$state.params.potId-1] = 0

    }

    $scope.torchToggleChange = function(){
      $scope.potContent.torchToggle[$state.params.potId-1] = $scope.torchToggle.checked;
      $scope.saveData('potContent');
    }

    $scope.getPotState = function(){
      return POT_STATES[$scope.potContent.potState[$state.params.potId-1]] || {};
    }

    $scope.getPotStateText = function(){
      return $scope.getPotState().text;
    }

    $scope.getPotColor = function(){
      return $scope.getPotState().color;
    }
    $scope.getNowTempStr = function(id){
      return $scope.temperature.nowTemp[id-1];
    }

    $scope.torchTemp = function(id){
        return (parseInt($scope.temperature.optionNow.indexOf(id))+1);
    }

    $scope.getNowTemp = function(id){
      return parseInt($scope.temperature.nowTemp[id-1]);
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
