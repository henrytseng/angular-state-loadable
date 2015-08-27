'use strict';

/* global document:false */

module.exports = ['$state', '$q', '$rootScope', function($state, $q, $rootScope) {

  // DOM target
  var _head;

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
  var _Loadable = function(src) {
    var _deferred = $q.defer();

    // Instance
    var _loadable = {

      src: src,

      // Loading completion flag
      isComplete: false,

      promise: _deferred.promise,

      // TODO switch to $document
      $element: document.createElement('script')
    };

    // Build DOM element
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

        _deferred.resolve(_loadable);
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
   * @param  {String}    src A source path for script asset
   * @return {_Loadable}     A loadable instance
   */
  var _createLoadable = function(src) {
    var loadable;

    // Valid state name required
    if(!src || src === '') {
      var error;
      error = new Error('Loadable requires a valid source.');
      error.code = 'invalidname';
      throw error;
    }

    // Already exists
    if(_loadableHash[src]) {
      loadable = _loadableHash[src];

    // Create new
    } else {
      // Create new instance
      loadable = new _Loadable(src);
      _loadableHash[src] = loadable;

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
   * Load all required items
   * 
   * @param  {Function} callback A callback, function(err)
   */
  var _load = function(callback) {
    var current = $state.current();

    // Evaluate
    if(current) {
      var sources = (typeof current.load === 'string' ? [current.load] : current.load) || [];
      
      // Get promises
      $q.all(sources.map(function(src) {
        return _createLoadable(src).promise;
      }))
          .then(function() {
            callback();
          }, function(err) {
            $rootScope.$broadcast('$loadableError', err);
            callback(err);
          });

    // No state
    } else {
      callback();
    }
  };

  /**
   * Create a loadable, get reference to existing methods
   * 
   * @param  {String}    src A source path for script asset
   * @return {Promise}       A promise fulfilled when the resource is loaded
   */
  _self.get = function(src) {
    return _createLoadable(src).promise;
  };

  /**
   * Get progress
   * 
   * @return {Number} A number 0..1 denoting current progress
   */
  _self.progress = _getProgress;

  /**
   * Ready
   */
  _self.$ready = function() {
    _head = angular.element(document.querySelector('head'))[0];
  };

  // Register middleware layer
  $state.$use(function(request, next) {
    _load(next);
  }, 1);

  return _self;
}];
