angular.module('starter.services', [])

.factory('$localstorage', function($window) {
  return {

    set: function(key, value) {
      $window.localStorage[key] = value;
    },

    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },

    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },

    getObject: function(key, defaultValue) {
      if(!$window.localStorage[key]) return defaultValue || {};
      return JSON.parse($window.localStorage[key]);
    },

    checkVersion: function(version){
      var curVersion = this.get('version', version);
      if(curVersion != version) $window.localStorage.clear();
      this.set('version', version);
    }

  }
})

.factory('$viewTerm', function($window) {
  return{
  getNowTemp : function(id){
    return parseInt($window.temperature.nowTemp[id-1]);
  },

  getTempColor : function(id){
    if (($window.getNowTemp(id)>$window.temperature.maxOut[id-1]) || ($window.getNowTemp(id)<$window.temperature.minOut[id-1])){
      return "assertive";
    }else{
          if (($window.getNowTemp(id)>$window.temperature.maxText[id-1]) || ($window.getNowTemp(id)<$window.temperature.minText[id-1])){
            return "calm";
          }else{
            return "balanced";
          }
    }
  },
 }
})
