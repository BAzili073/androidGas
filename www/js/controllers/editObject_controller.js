angular.module('starter.controllers')

.controller('editorController', function($scope, $state, $ionicPopup, $location) {

  $scope.selected = $scope.objects.items[$scope.objects.items[0].id-1];
  $scope.resetForm = function() {
    $scope.objectLabel = $scope.objects.items[$scope.selected.id-1].label;
  }

  $scope.setObjectName = function(){
    $scope.objects.items[$scope.selected.id-1].label = $scope.objectLabel;
  }

  $scope.resetForm();

  $scope.deleteObject = function() {
       $scope.data = {
          choice: false
       }

       // An elaborate, custom popup
       var deleteObj = $ionicPopup.show({
         template: '<ion-radio ng-model="data.choice" ng-value=true>Да</ion-radio><ion-radio ng-model="data.choice" ng-value=false>Нет</ion-radio>',
         title: 'Удалить объект ' + ($scope.selected.id-1) ,
         scope: $scope,
         buttons: [
           {
             text: '<b>Принять</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.choice) {

               } else {
                 $scope.objects.items.splice($scope.selected.id-1,1);
                 $scope.deletePotData($scope.selected.id-1);
                 if (($scope.selected.id-1) == $scope.potNumber) $scope.potNumber = $scope.objects.items[0].id;
               }
             }
           }
         ]
       });
     };
     $scope.createObject = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var create = $ionicPopup.show({
          template: '<input type="text" ng-model="data.label">',
          title: 'Название объекта',
          scope: $scope,
          buttons: [
            { text: 'Отмена' },
            {
              text: '<b>Добавить</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.label) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  $scope.data.id = $scope.objects.items[$scope.objects.items.length-1].id+1;
                  $scope.objects.items.push($scope.data)
                }
              }
            }
          ]
        });
      }
  })
