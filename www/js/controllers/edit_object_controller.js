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

  $scope.selected = $scope.localobjects.items[0];

  $scope.resetForm = function() {
    $scope.objectLabel = $scope.objects.items[$scope.selected.id].label;
  }

  $scope.setObjectName = function(){
    $scope.objects.items[$scope.selected.id].label = $scope.objectLabel;
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
                 if ($scope.objects.items[$scope.selected.id].id == $scope.potNumber){ $scope.setPot()
                    }
                $scope.objects.items.splice($scope.selected.id,1);
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
