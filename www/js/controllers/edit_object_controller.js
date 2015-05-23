angular.module('starter.controllers')

.controller('editorController', function($scope, $state, $ionicPopup, $location) {
  $scope.localobjects = {
      items : [],
    };

    for(var i = 0; i < ($scope.objects.items.length); i++) {
        $scope.localobjects.items.push({
        id : i,
        label : $scope.objects.items[i].label
      })
      }

  $scope.potCheck = [$scope.potContent.seePot[0],$scope.potContent.seePot[1],$scope.potContent.seePot[2]]

  $scope.selected = $scope.localobjects.items[0];

  $scope.resetForm = function() {
    $scope.objectLabel = $scope.objects.items[$scope.selected.id].label;
    $scope.potCheck[0] = $scope.potContent.seePot[0];
    $scope.potCheck[1] = $scope.potContent.seePot[1];
    $scope.potCheck[2] = $scope.potContent.seePot[2];
  }

  $scope.setObjectName = function(){
    $scope.potContent.seePot[0] = $scope.potCheck[0];
    $scope.potContent.seePot[1] = $scope.potCheck[1];
    $scope.potContent.seePot[2] = $scope.potCheck[2];
    $scope.objects.items[$scope.selected.id].label = $scope.objectLabel;
    $scope.saveObjects('objects');
    $scope.saveData('potContent');
    $state.go($state.current, {}, {reload: true});
  }

  $scope.resetForm();

  $scope.deleteObject = function() {
       $scope.data = {

       }

       // An elaborate, custom popup
       var deleteObj = $ionicPopup.show({
         title: 'Удалить объект:"' + ($scope.objects.items[$scope.selected.id].label)+'"' ,
         scope: $scope,
         buttons: [
           {
             text: '<b>Нет</b>',
             type: 'button-positive',
           },
           {
             text: '<b>Да</b>',
             type: 'button-positive',
             onTap: function(e) {
                 $scope.deletePotData($scope.objects.items[$scope.selected.id].id);
                 $state.go($state.current, {}, {reload: true});
                if ((_.find($scope.objects.items, {label: $scope.selected.label})).id == $scope.potNumber){
                  $scope.objects.items.splice($scope.selected.id,1);
                  $scope.setPot()
                }else{$scope.objects.items.splice($scope.selected.id,1);}
                $scope.saveObjects('objects');
             }
           }
         ]
       });
     };

     $scope.createObject = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var create = $ionicPopup.show({
          template: '<input type="text" ng-model="data.label" placeholder="До 15 символов" >',
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
                  $scope.objects.items.push($scope.data);
                  $scope.saveObjects('objects');
                  $state.go($state.current, {}, {reload: true});
                }
              }
            }
          ]
        });
      }
  })
