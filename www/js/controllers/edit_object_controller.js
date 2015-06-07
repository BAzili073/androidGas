angular.module('starter.controllers')

.controller('editorController', function($scope,$cordovaToast, $state, $ionicPopup, $location) {
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

  $scope.changeObject = function(){
    $scope.lastObjId = $scope.potNumber;
    $scope.saveAllData();
    $scope.setPot($scope.selected.id);
    $scope.createObject($scope.objects.items[$scope.selected.id],$scope.selected.id);
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

     $scope.createObject = function(obj,id) {
        if (obj){ $scope.data = obj;
          $scope.dataPot = $scope.potContent.seePot;
        } else{
            $scope.data= {};
            $scope.dataPot = [true,true,true]
        };

        // An elaborate, custom popup
        var create = $ionicPopup.show({
          template: 'Название:<input type="text" ng-model="data.label" placeholder="До 15 символов" ></br>Номер:<input type="text" ng-model="data.number" placeholder="+79876543210">Котлы:<div class="item item-input"><label class="col col"><ion-checkbox class="noMargin " ng-model="dataPot[0]"></ion-checkbox></label><label class="col col"><ion-checkbox class="noMargin " ng-model="dataPot[1]"></ion-checkbox></label><label class="col col"><ion-checkbox class="noMargin " ng-model="dataPot[2]"></ion-checkbox></label></div>',
          title: 'Объект',
          scope: $scope,
          buttons: [
            { text: 'Отмена',
            onTap: function() {
              if (obj) {
                  $scope.setPot($scope.lastObjId);
              }
            }
            },
            {
              text: '<b>Принять</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.label) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  if (obj){
                    $scope.potContent.seePot = $scope.dataPot;
                    $scope.objects.items[id].label = $scope.data.label;
                    $scope.objects.items[id].number = $scope.data.number;
                    $scope.saveData('potContent');
                    $cordovaToast.showLongBottom('Объект "' + $scope.data.label + '" изменен');
                  }else{
                      $scope.data.id = $scope.objects.items[$scope.objects.items.length-1].id+1;
                      $scope.objects.items.push($scope.data);
                      $scope.lastObjId = $scope.potNumber;
                      $scope.saveAllData();
                      $scope.setPot($scope.objects.items.length-1);
                      $cordovaToast.showLongBottom('Объект "' + $scope.data.label + '" добавлен');
                  }
                  $scope.setPotNumber($scope.data.number);
                  $scope.setPot($scope.lastObjId);
                  $scope.saveObjects('objects');
                  $state.go($state.current, {}, {reload: true});

                }
              }
            }
          ]
        });
      }
  })
