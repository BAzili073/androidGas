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

    $scope.statToggleSaturnChangeSuccessful = function(data){
      $scope.handContent.outputsSaturn[data[1]] = data[0];
      $scope.saveData('handContent');
      $scope.toggleSendSuccesful();
    }

    $scope.statToggleSaturnChange = function(number){
      var pot_number = number + 1;
      var data = [$scope.statOutput[number].checked,number];
      $scope.sendSmsMessage(COMMANDS.SET_OUTPUT(pot_number, $scope.statOutput[number].checked),$scope.statToggleSaturnChangeSuccessful,$scope.toggleSendError,data)
    }

    $scope.statToggleModuleChangeSuccessful = function(data){
      $scope.handContent.outputsModule[data[1]] = data[0];
      $scope.saveData('handContent');
      $scope.toggleSendSuccesful();
    }

      $scope.statToggleModuleChange = function(number){
        var pot_number = number + 4;
        var data = [$scope.statOutput[pot_number].checked,number];
        $scope.sendSmsMessage(COMMANDS.CONTROL_POT($scope.statOutput[number].checked,number),$scope.statToggleModuleChangeSuccessful,$scope.toggleSendError,data);
      }

      $scope.getTextGuardOutput = function(number){
        if ($scope.nrOptions.guardOutput[number]) return $scope.nrOptions.guardOutput[number]
        else return "Выход " + number;
      }
      $scope.getTextModuleOutput = function(number){
        if ($scope.nrOptions.moduleOutput[number]) return $scope.nrOptions.moduleOutput[number]
        else return "Доп.выход " + number;
      }
  })
