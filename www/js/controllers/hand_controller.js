angular.module('starter.controllers')

.controller('handController', function($scope, $state, $ionicPopup, $location) {
    $scope.statOutput = [
      {checked: $scope.handContent.outputs[0]},
      {checked: $scope.handContent.outputs[1]},
      {checked: $scope.handContent.outputs[2]},
      {checked: $scope.handContent.outputs[3]},
      {checked: $scope.handContent.outputs[4]},
      {checked: $scope.handContent.outputs[5]},
    ];

    $scope.statToggleChange = function(number){
      $scope.handContent.outputs[number] = $scope.statOutput[number].checked;
      $scope.saveData('handContent');
    }
  })

  
