angular.module('starter.controllers')

.controller('gaspotController', function($scope, $state, POT_STATES, $ionicPopup) {

   $scope.statToggle = {
     checked: $scope.potContent.statToggle[$state.params.potId-1]
   }

   $scope.torchToggle = {
     checked: $scope.potContent.torchToggle[$state.params.potId-1]
   }

  $scope.potId = function() {
    return $state.params.potId;
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


})
