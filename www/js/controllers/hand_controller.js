angular.module('starter.controllers')

.controller('handController', function($scope, $state, $ionicPopup, $location) {
    $scope.statOutput = [
      {checked: $scope.handContent.outputsSaturn[0]},
      {checked: $scope.handContent.outputsSaturn[1]},
      {checked: $scope.handContent.outputsSaturn[2]},
      {checked: $scope.handContent.outputsSaturn[3]},
      {checked: $scope.handContent.outputsModule[0]},
      {checked: $scope.handContent.outputsModule[1]},
    ];

    $scope.statToggleSaturnChange = function(number){
      $scope.handContent.outputsSaturn[number] = $scope.statOutput[number].checked;
      $scope.saveData('handContent');
    }

      $scope.statToggleModuleChange = function(number){
        $scope.handContent.outputsModule[number] = $scope.statOutput[number].checked;
        $scope.saveData('handContent');
      }
  })
