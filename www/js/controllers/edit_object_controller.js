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
    $scope.potCheck = [$scope.potContent.seePot[0],$scope.potContent.seePot[1],$scope.potContent.seePot[2]];
    $scope.selected = $scope.localobjects.items[0];

  $scope.resetForm = function() {
    $scope.objectLabel = $scope.objects.items[$scope.selected.id].label;
    $scope.potCheck[0] = $scope.potContent.seePot[0];
    $scope.potCheck[1] = $scope.potContent.seePot[1];
    $scope.potCheck[2] = $scope.potContent.seePot[2];
  }

  $scope.changeObject = function(){
    $scope.lastObjId = $scope.getIndexCurrentPot();
    $scope.saveAllData();
    $scope.setPot($scope.selected.id);
    $scope.createObject($scope.objects.items[$scope.selected.id],$scope.selected.id);
  }


  $scope.deleteObject = function() {
       $scope.data = {

       }
       var fullDeleteObject = function(){
         $scope.showToast('Объект "' + ($scope.objects.items[$scope.selected.id].label) + '(' + ($scope.objects.items[$scope.selected.id].number) + '") удален');
         $scope.saveHistory ($scope.getCurrentTime(),"Объект " + ($scope.objects.items[$scope.selected.id].label) + "(" + ($scope.objects.items[$scope.selected.id].number) + ")"+ " удален")
         $scope.deletePotData($scope.objects.items[$scope.selected.id].id);
         $scope.objects.items.splice($scope.selected.id,1);
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

                //  console.log($scope.potNumber);
                 $state.go($state.current, {}, {reload: true});
                if ((_.find($scope.objects.items, {label: $scope.selected.label})).id == $scope.potNumber){
                  if ($scope.objects.items.length == 1) {
                    $scope.showToast('Невозможно удалить объект');
                  }else{
                    fullDeleteObject();
                    $scope.setPot(0);
                  }
                }else{fullDeleteObject();}
                $scope.saveObjects('objects');
             }
           }
         ]
       });
     };

     $scope.createObject = function(obj,id) {
        if (obj){ $scope.data = obj;
          $scope.dataPot = $scope.potContent.seePot;
          $scope.data.setModule = $scope.potContent.setModule;
        } else{
            $scope.data = {setModule:true};
            $scope.dataPot = [true,true,true]
        };

        // An elaborate, custom popup
        var create = $ionicPopup.show({
          template: 'Название:<input type="text" ng-model="data.label" placeholder="До 15 символов" ></br>Тел.номер:<input type="text" ng-model="data.number" placeholder="+79876543210"></br><div><label><ion-checkbox class="noMargin " ng-model="data.setModule">Доп.модуль</ion-checkbox></label></div><div ng-show="data.setModule">Котлы:<div class="item item-input"><label class="col col"><ion-checkbox class="noMargin " ng-model="dataPot[0]"></ion-checkbox></label><label class="col col"><ion-checkbox class="noMargin " ng-model="dataPot[1]"></ion-checkbox></label><label class="col col"><ion-checkbox class="noMargin " ng-model="dataPot[2]"></ion-checkbox></label></div><div>',
          title: 'Объект',
          scope: $scope,
          buttons: [
            { text: 'Отмена',
            onTap: function() {
              if (!$scope.deviceVar.presenceObject) {
                if ($scope.deviceVar.device) $scope.exitServiceGas();
                else $scope.createObject();
              }
              if (obj) {
                  $scope.setPot($scope.lastObjId);
              }
            }
            },
            {
              text: '<b>Принять</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.label || !$scope.data.number) {
                  $scope.showToast('Заполните все поля');
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  if (obj){
                    $scope.objects.items[id].label = $scope.data.label;
                    $scope.objects.items[id].number = $scope.data.number;
                    $scope.showToast('Объект "' + $scope.data.label + '" изменен');
                    $scope.saveHistory ($scope.getCurrentTime(),"Объект " + $scope.data.label + "(" + $scope.data.number + ")"+ " изменен")
                  }else{
                    if (!$scope.deviceVar.presenceObject){
                        $scope.data.id = 0;
                        $scope.lastObjId = 0;
                      }else {
                        $scope.data.id = $scope.objects.items[$scope.objects.items.length-1].id+1;
                        $scope.lastObjId = $scope.potNumber;
                      }
                      $scope.objects.items.push($scope.data);
                      $scope.saveAllData();
                      $scope.setPot($scope.objects.items.length-1);
                      $scope.showToast('Объект "' + $scope.data.label + '" добавлен');
                      $scope.saveHistory ($scope.getCurrentTime(),"Объект " + $scope.data.label + "(" + $scope.data.number + ")"+ " создан");
                  }
                  $scope.deviceVar.presenceObject = true;
                  $scope.potContent.setModule = $scope.data.setModule;
                  $scope.potContent.seePot = $scope.dataPot;
                  $scope.saveData('potContent');
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
      $scope.regInObjectSucc = function(){
        $scope.showToast("Звонок на объект");
      }
      $scope.regInObject = function(){
        $scope.callPhone($scope.regInObjectSucc,false,$scope.objects.items[$scope.selected.id].number);
      }
      if (!$scope.deviceVar.presenceObject) $scope.createObject();
      else $scope.resetForm();
  })
