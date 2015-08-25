'use strict';

/* global angular:false */

// CommonJS
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'angular-state-loadable';
}

// Assume polyfill used in StateRouter exists

// Instantiate module
angular.module('angular-state-loadable', ['angular-state-router'])

  .factory('$loadableManager', require('./services/loadable-manager'))

  .run(['$loadableManager', function($loadableManager) {
    $loadableManager.$ready();
  }]);
