angular.module('starter.controllers')

.controller('guardController', function($scope, $state) {

  $scope.statToggle = {
    checked: $scope.guardContent.statGuard
  }


   $scope.statToggleChange = function(){
     $scope.guardContent.stateGuard = $scope.statToggle.checked;
     $scope.saveData('guardContent');
     $scope.guardContent.statusGuard = 0
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
     return $scope.setColors($scope.guardContent.outputs[number])
     }

})
