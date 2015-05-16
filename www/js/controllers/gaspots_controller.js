angular.module('starter.controllers')

.controller('gaspotsController', function($scope, POT_STATES, $ionicPopup) {

  $scope.getPotState = function(id){
    return POT_STATES[$scope.potContent.potState[id]];
  }

  $scope.getPotStateText = function(id){
    return $scope.getPotState(id).text;
  }

  $scope.getPotColor = function(id){
    return $scope.getPotState(id).color;
  }

  $scope.getInputColor = function(number){
    return $scope.setColors($scope.potContent.inputs[number])
  }
  $scope.getOutputColor = function(number){
     return $scope.setOutputColors($scope.potContent.outputs[number])
  }

  $scope.seeOutputComment = function(id) {
       $scope.data = {
         idOutput: id-1,
         comment: $scope.ssOptions.moduleOutput[id-1],
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
                 //don't allow the user to close unцless he enters wifi password
                 e.preventDefault();
               } else {
                 return $scope.data;
               }
             }
           }
         ]
       });
       outputComment.then(function(data) {
         $scope.ssOptions.moduleOutput[data.idOutput] = data.comment;
         $scope.saveData('ssOptions');
         // console.log('Tapped!', data.comment);
       });
      };

      $scope.seeInputComment = function(id) {
           $scope.data = {
             idInput: id-1,
             comment: $scope.ssOptions.text[id+4],
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
})
