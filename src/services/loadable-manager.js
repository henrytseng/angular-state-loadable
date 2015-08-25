'use strict';

/* global process:false */

module.exports = ['$state', '$q', '$document', '$rootScope', function($state, $q, $document, $rootScope) {

  // Instance
  var _self = {};

  // Library
  var _loadableHash = {};

  // Progress
  var _loadingList = [];
  var _completedList = [];

  /**
   * A loaded resource, adds self to DOM, self manage progress
   * 
   * @return {_Loadable} An instance
   */
  var _Loadable = function(state, src) {
    // Instance
    var _loadable = {

      state: state,

      src: src,

      // Loading completion flag
      isComplete: false,

      promise: $q.defer(),

      $element: $document.createElement('script')

    };

    // Build DOM element
    var _head = $document.getElementsByTagName("head")[0] || $document.documentElement;
    _loadable.$element.src = src;
    _loadable.$element.type = 'text/javascript';
    _loadable.$element.async = false;
    _head.insertBefore(_loadable.$element, _head.firstChild);

    // Mark loading in progress
    _loadingList.push(_loadable);

    // Completion
    _loadable.$element.onload = _loadable.$element.onreadystatechange = function() {

      if(!_loadable.isComplete && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        _loadable.isComplete = true;
        _loadable.$element.onload = _loadable.$element.onreadystatechange = null;
        
        if(_head && _loadable.$element.parentNode) {
          _head.removeChild(_loadable.$element);
        }

        // Mark complete
        var i = _loadingList.indexOf(_loadable);
        if(i !== -1) {
          _loadingList.splice(i, 1);
        }
        _completedList.push(_loadable);

        _loadable.promise.resolve(_loadable);
      }
    };

    return _loadable;
  };

  /**
   * Get progress
   * 
   * @return {Number} A number 0..1 denoting progress
   */
  var _getProgress = function() {
    var loaded = _loadingList.length;
    var total = _loadingList.length + _completedList.length;
    return Math.min(1, Math.max(0, loaded/total));
  };

  /**
   * Create a _Loadable.  Does not replace previously created instances.  
   * 
   * @param  {String}  state A state name
   * @param  {String}  src   A source path for script asset
   * @return {_Loadable}      A loadable instance
   */
  var _createLoadable = function(state, src) {
    var loadable;

    // Valid state name required
    if(!state || state === '') {
      var error;
      error = new Error('Loadable requires a valid state name.');
      error.code = 'invalidname';
      throw error;
    }

    // Already exists
    if(_loadableHash[state]) {
      loadable = _loadableHash[state];

    // Create new
    } else {
      // Create new instance
      loadable = new _Loadable(state, src);
      _loadableHash[state] = loadable;

      // Broadcast creation, progress
      $rootScope.$broadcast('$loadableCreated', loadable);
      $rootScope.$broadcast('$loadableProgress', _getProgress());

      // Completion
      loadable.promise.then(function() {

        // Broadcast complete
        $rootScope.$broadcast('$loadableProgress', _getProgress());
        if(_loadingList.length === 0) {
          $rootScope.$broadcast('$loadableComplete', loadable);
        }
      });
    }

    return loadable;
  };

  /**
   * Get loadable, if does not exist create
   * 
   * @param  {String}  state A state name
   * @return {_Loadable}      A loadable instance
   */
  var _getLoadable = function(state) {
    return _loadableHash[state];
  };

  /**
   * Create a loadable, get reference to existing methods
   */
  _self.create = _createLoadable;

  /**
   * Get a loadable
   */
  _self.get = _getLoadable;

  /**
   * Get progress
   * 
   * @return {Number} A number 0..1 denoting current progress
   */
  _self.progress = _getProgress;

  // Register middleware layer
  $state.$use(function(request, next) {
    next();
  });

  return _self;
}];
