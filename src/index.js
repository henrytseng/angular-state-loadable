'use strict';

/* global angular:false */

// CommonJS
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'angular-state-loadable';
}

// Polyfill
require('./utils/object');
require('./utils/process');
require('./utils/function');

// Instantiate module
angular.module('angular-state-loadable', []);
