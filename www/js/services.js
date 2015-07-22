angular.module('starter.services', [])

.factory('$localstorage', function($window,$state) {
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

    saveStorage: function(){
      return JSON.stringify($window.localStorage);
    },

    loadStorage: function(all){
      _.forOwn(JSON.parse(all),function(value,key){$window.localStorage[key] = value;})
    },

    checkVersion: function(version){
      var curVersion = this.get('version', version);
      if(curVersion != version)   _.forOwn($window.localStorage,function(value,key){$window.localStorage.clear();})
      this.set('version', version);
    }

  }
})
