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
      $scope.startModal(1000);
      var pot_number = number + 1;
      if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.SET_OUTPUT(pot_number, $scope.statOutput[number].checked), function(){
          $scope.handContent.outputsSaturn[number] = $scope.statOutput[number].checked;
          $scope.saveData('handContent');
          $scope.toggleSendSuccesful();
      }, $scope.toggleSendError());
      // console.log(COMMANDS.SET_OUTPUT(pot_number, $scope.statOutput[number].checked));
    }

      $scope.statToggleModuleChange = function(number){
        $scope.startModal(1000);
        number = number + 4;
        var pot_number = number + 4;
        if(window.SMS) SMS.sendSMS($scope.phones.pot, COMMANDS.CONTROL_POT($scope.statOutput[number].checked,number), function(){
        $scope.handContent.outputsModule[number] = $scope.statOutput[number].checked;
        $scope.saveData('handContent');
        $scope.toggleSendSuccesful();
        }, $scope.toggleSendError());
        // console.log(COMMANDS.CONTROL_POT($scope.statOutput[number].checked,pot_number));
      }
  })
