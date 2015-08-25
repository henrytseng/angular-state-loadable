(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./services/loadable-manager":2}],2:[function(require,module,exports){
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
   */
  _self.get = _createLoadable;

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaGVucnkvSG9tZVN5bmMvQ2FudmFzL3Byb2plY3RzL2FuZ3VsYXItc3RhdGUtbG9hZGFibGUvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2hlbnJ5L0hvbWVTeW5jL0NhbnZhcy9wcm9qZWN0cy9hbmd1bGFyLXN0YXRlLWxvYWRhYmxlL3NyYy9zZXJ2aWNlcy9sb2FkYWJsZS1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7O0FBS0EsSUFBSSxPQUFPLFdBQVcsZUFBZSxPQUFPLFlBQVksZUFBZSxPQUFPLFlBQVksUUFBUTtFQUNoRyxPQUFPLFVBQVU7Ozs7OztBQU1uQixRQUFRLE9BQU8sMEJBQTBCLENBQUM7O0dBRXZDLFFBQVEsb0JBQW9CLFFBQVE7O0dBRXBDLElBQUksQ0FBQyxvQkFBb0IsU0FBUyxrQkFBa0I7SUFDbkQsaUJBQWlCOztBQUVyQjs7QUNuQkE7Ozs7QUFJQSxPQUFPLFVBQVUsQ0FBQyxVQUFVLE1BQU0sY0FBYyxTQUFTLFFBQVEsSUFBSSxZQUFZOzs7RUFHL0UsSUFBSTs7O0VBR0osSUFBSSxRQUFROzs7RUFHWixJQUFJLGdCQUFnQjs7O0VBR3BCLElBQUksZUFBZTtFQUNuQixJQUFJLGlCQUFpQjs7Ozs7OztFQU9yQixJQUFJLFlBQVksU0FBUyxLQUFLO0lBQzVCLElBQUksWUFBWSxHQUFHOzs7SUFHbkIsSUFBSSxZQUFZOztNQUVkLEtBQUs7OztNQUdMLFlBQVk7O01BRVosU0FBUyxVQUFVOzs7TUFHbkIsVUFBVSxTQUFTLGNBQWM7Ozs7SUFJbkMsVUFBVSxTQUFTLE1BQU07SUFDekIsVUFBVSxTQUFTLE9BQU87SUFDMUIsVUFBVSxTQUFTLFFBQVE7O0lBRTNCLE1BQU0sYUFBYSxVQUFVLFVBQVUsTUFBTTs7O0lBRzdDLGFBQWEsS0FBSzs7O0lBR2xCLFVBQVUsU0FBUyxTQUFTLFVBQVUsU0FBUyxxQkFBcUIsV0FBVzs7TUFFN0UsR0FBRyxDQUFDLFVBQVUsZUFBZSxDQUFDLEtBQUssY0FBYyxLQUFLLGVBQWUsWUFBWSxLQUFLLGVBQWUsYUFBYTtRQUNoSCxVQUFVLGFBQWE7UUFDdkIsVUFBVSxTQUFTLFNBQVMsVUFBVSxTQUFTLHFCQUFxQjs7UUFFcEUsR0FBRyxTQUFTLFVBQVUsU0FBUyxZQUFZO1VBQ3pDLE1BQU0sWUFBWSxVQUFVOzs7O1FBSTlCLElBQUksSUFBSSxhQUFhLFFBQVE7UUFDN0IsR0FBRyxNQUFNLENBQUMsR0FBRztVQUNYLGFBQWEsT0FBTyxHQUFHOztRQUV6QixlQUFlLEtBQUs7O1FBRXBCLFVBQVUsUUFBUTs7OztJQUl0QixPQUFPOzs7Ozs7OztFQVFULElBQUksZUFBZSxXQUFXO0lBQzVCLElBQUksU0FBUyxhQUFhO0lBQzFCLElBQUksUUFBUSxhQUFhLFNBQVMsZUFBZTtJQUNqRCxPQUFPLEtBQUssSUFBSSxHQUFHLEtBQUssSUFBSSxHQUFHLE9BQU87Ozs7Ozs7OztFQVN4QyxJQUFJLGtCQUFrQixTQUFTLEtBQUs7SUFDbEMsSUFBSTs7O0lBR0osR0FBRyxDQUFDLE9BQU8sUUFBUSxJQUFJO01BQ3JCLElBQUk7TUFDSixRQUFRLElBQUksTUFBTTtNQUNsQixNQUFNLE9BQU87TUFDYixNQUFNOzs7O0lBSVIsR0FBRyxjQUFjLE1BQU07TUFDckIsV0FBVyxjQUFjOzs7V0FHcEI7O01BRUwsV0FBVyxJQUFJLFVBQVU7TUFDekIsY0FBYyxPQUFPOzs7TUFHckIsV0FBVyxXQUFXLG9CQUFvQjtNQUMxQyxXQUFXLFdBQVcscUJBQXFCOzs7TUFHM0MsU0FBUyxRQUFRLEtBQUssV0FBVzs7O1FBRy9CLFdBQVcsV0FBVyxxQkFBcUI7UUFDM0MsR0FBRyxhQUFhLFdBQVcsR0FBRztVQUM1QixXQUFXLFdBQVcscUJBQXFCOzs7OztJQUtqRCxPQUFPOzs7Ozs7OztFQVFULElBQUksUUFBUSxTQUFTLFVBQVU7SUFDN0IsSUFBSSxVQUFVLE9BQU87OztJQUdyQixHQUFHLFNBQVM7TUFDVixJQUFJLFVBQVUsQ0FBQyxPQUFPLFFBQVEsU0FBUyxXQUFXLENBQUMsUUFBUSxRQUFRLFFBQVEsU0FBUzs7O01BR3BGLEdBQUcsSUFBSSxRQUFRLElBQUksU0FBUyxLQUFLO1FBQy9CLE9BQU8sZ0JBQWdCLEtBQUs7O1dBRXpCLEtBQUssV0FBVztZQUNmO2FBQ0MsU0FBUyxLQUFLO1lBQ2YsV0FBVyxXQUFXLGtCQUFrQjtZQUN4QyxTQUFTOzs7O1dBSVY7TUFDTDs7Ozs7OztFQU9KLE1BQU0sTUFBTTs7Ozs7OztFQU9aLE1BQU0sV0FBVzs7Ozs7RUFLakIsTUFBTSxTQUFTLFdBQVc7SUFDeEIsUUFBUSxRQUFRLFFBQVEsU0FBUyxjQUFjLFNBQVM7Ozs7RUFJMUQsT0FBTyxLQUFLLFNBQVMsU0FBUyxNQUFNO0lBQ2xDLE1BQU07S0FDTDs7RUFFSCxPQUFPOztBQUVUIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIGFuZ3VsYXI6ZmFsc2UgKi9cblxuLy8gQ29tbW9uSlNcbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzID09PSBleHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSAnYW5ndWxhci1zdGF0ZS1sb2FkYWJsZSc7XG59XG5cbi8vIEFzc3VtZSBwb2x5ZmlsbCB1c2VkIGluIFN0YXRlUm91dGVyIGV4aXN0c1xuXG4vLyBJbnN0YW50aWF0ZSBtb2R1bGVcbmFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyLXN0YXRlLWxvYWRhYmxlJywgWydhbmd1bGFyLXN0YXRlLXJvdXRlciddKVxuXG4gIC5mYWN0b3J5KCckbG9hZGFibGVNYW5hZ2VyJywgcmVxdWlyZSgnLi9zZXJ2aWNlcy9sb2FkYWJsZS1tYW5hZ2VyJykpXG5cbiAgLnJ1bihbJyRsb2FkYWJsZU1hbmFnZXInLCBmdW5jdGlvbigkbG9hZGFibGVNYW5hZ2VyKSB7XG4gICAgJGxvYWRhYmxlTWFuYWdlci4kcmVhZHkoKTtcbiAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBnbG9iYWwgZG9jdW1lbnQ6ZmFsc2UgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZScsICckcScsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHN0YXRlLCAkcSwgJHJvb3RTY29wZSkge1xuXG4gIC8vIERPTSB0YXJnZXRcbiAgdmFyIF9oZWFkO1xuXG4gIC8vIEluc3RhbmNlXG4gIHZhciBfc2VsZiA9IHt9O1xuXG4gIC8vIExpYnJhcnlcbiAgdmFyIF9sb2FkYWJsZUhhc2ggPSB7fTtcblxuICAvLyBQcm9ncmVzc1xuICB2YXIgX2xvYWRpbmdMaXN0ID0gW107XG4gIHZhciBfY29tcGxldGVkTGlzdCA9IFtdO1xuXG4gIC8qKlxuICAgKiBBIGxvYWRlZCByZXNvdXJjZSwgYWRkcyBzZWxmIHRvIERPTSwgc2VsZiBtYW5hZ2UgcHJvZ3Jlc3NcbiAgICogXG4gICAqIEByZXR1cm4ge19Mb2FkYWJsZX0gQW4gaW5zdGFuY2VcbiAgICovXG4gIHZhciBfTG9hZGFibGUgPSBmdW5jdGlvbihzcmMpIHtcbiAgICB2YXIgX2RlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgIC8vIEluc3RhbmNlXG4gICAgdmFyIF9sb2FkYWJsZSA9IHtcblxuICAgICAgc3JjOiBzcmMsXG5cbiAgICAgIC8vIExvYWRpbmcgY29tcGxldGlvbiBmbGFnXG4gICAgICBpc0NvbXBsZXRlOiBmYWxzZSxcblxuICAgICAgcHJvbWlzZTogX2RlZmVycmVkLnByb21pc2UsXG5cbiAgICAgIC8vIFRPRE8gc3dpdGNoIHRvICRkb2N1bWVudFxuICAgICAgJGVsZW1lbnQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgfTtcblxuICAgIC8vIEJ1aWxkIERPTSBlbGVtZW50XG4gICAgX2xvYWRhYmxlLiRlbGVtZW50LnNyYyA9IHNyYztcbiAgICBfbG9hZGFibGUuJGVsZW1lbnQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIF9sb2FkYWJsZS4kZWxlbWVudC5hc3luYyA9IGZhbHNlO1xuXG4gICAgX2hlYWQuaW5zZXJ0QmVmb3JlKF9sb2FkYWJsZS4kZWxlbWVudCwgX2hlYWQuZmlyc3RDaGlsZCk7XG5cbiAgICAvLyBNYXJrIGxvYWRpbmcgaW4gcHJvZ3Jlc3NcbiAgICBfbG9hZGluZ0xpc3QucHVzaChfbG9hZGFibGUpO1xuXG4gICAgLy8gQ29tcGxldGlvblxuICAgIF9sb2FkYWJsZS4kZWxlbWVudC5vbmxvYWQgPSBfbG9hZGFibGUuJGVsZW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIGlmKCFfbG9hZGFibGUuaXNDb21wbGV0ZSAmJiAoIXRoaXMucmVhZHlTdGF0ZSB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFwibG9hZGVkXCIgfHwgdGhpcy5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpKSB7XG4gICAgICAgIF9sb2FkYWJsZS5pc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgX2xvYWRhYmxlLiRlbGVtZW50Lm9ubG9hZCA9IF9sb2FkYWJsZS4kZWxlbWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgaWYoX2hlYWQgJiYgX2xvYWRhYmxlLiRlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICBfaGVhZC5yZW1vdmVDaGlsZChfbG9hZGFibGUuJGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFyayBjb21wbGV0ZVxuICAgICAgICB2YXIgaSA9IF9sb2FkaW5nTGlzdC5pbmRleE9mKF9sb2FkYWJsZSk7XG4gICAgICAgIGlmKGkgIT09IC0xKSB7XG4gICAgICAgICAgX2xvYWRpbmdMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBfY29tcGxldGVkTGlzdC5wdXNoKF9sb2FkYWJsZSk7XG5cbiAgICAgICAgX2RlZmVycmVkLnJlc29sdmUoX2xvYWRhYmxlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF9sb2FkYWJsZTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHByb2dyZXNzXG4gICAqIFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEEgbnVtYmVyIDAuLjEgZGVub3RpbmcgcHJvZ3Jlc3NcbiAgICovXG4gIHZhciBfZ2V0UHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9hZGVkID0gX2xvYWRpbmdMaXN0Lmxlbmd0aDtcbiAgICB2YXIgdG90YWwgPSBfbG9hZGluZ0xpc3QubGVuZ3RoICsgX2NvbXBsZXRlZExpc3QubGVuZ3RoO1xuICAgIHJldHVybiBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCBsb2FkZWQvdG90YWwpKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgX0xvYWRhYmxlLiAgRG9lcyBub3QgcmVwbGFjZSBwcmV2aW91c2x5IGNyZWF0ZWQgaW5zdGFuY2VzLiAgXG4gICAqIFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgIHNyYyBBIHNvdXJjZSBwYXRoIGZvciBzY3JpcHQgYXNzZXRcbiAgICogQHJldHVybiB7X0xvYWRhYmxlfSAgICAgQSBsb2FkYWJsZSBpbnN0YW5jZVxuICAgKi9cbiAgdmFyIF9jcmVhdGVMb2FkYWJsZSA9IGZ1bmN0aW9uKHNyYykge1xuICAgIHZhciBsb2FkYWJsZTtcblxuICAgIC8vIFZhbGlkIHN0YXRlIG5hbWUgcmVxdWlyZWRcbiAgICBpZighc3JjIHx8IHNyYyA9PT0gJycpIHtcbiAgICAgIHZhciBlcnJvcjtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdMb2FkYWJsZSByZXF1aXJlcyBhIHZhbGlkIHNvdXJjZS4nKTtcbiAgICAgIGVycm9yLmNvZGUgPSAnaW52YWxpZG5hbWUnO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgLy8gQWxyZWFkeSBleGlzdHNcbiAgICBpZihfbG9hZGFibGVIYXNoW3NyY10pIHtcbiAgICAgIGxvYWRhYmxlID0gX2xvYWRhYmxlSGFzaFtzcmNdO1xuXG4gICAgLy8gQ3JlYXRlIG5ld1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDcmVhdGUgbmV3IGluc3RhbmNlXG4gICAgICBsb2FkYWJsZSA9IG5ldyBfTG9hZGFibGUoc3JjKTtcbiAgICAgIF9sb2FkYWJsZUhhc2hbc3JjXSA9IGxvYWRhYmxlO1xuXG4gICAgICAvLyBCcm9hZGNhc3QgY3JlYXRpb24sIHByb2dyZXNzXG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRsb2FkYWJsZUNyZWF0ZWQnLCBsb2FkYWJsZSk7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRsb2FkYWJsZVByb2dyZXNzJywgX2dldFByb2dyZXNzKCkpO1xuXG4gICAgICAvLyBDb21wbGV0aW9uXG4gICAgICBsb2FkYWJsZS5wcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gQnJvYWRjYXN0IGNvbXBsZXRlXG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJGxvYWRhYmxlUHJvZ3Jlc3MnLCBfZ2V0UHJvZ3Jlc3MoKSk7XG4gICAgICAgIGlmKF9sb2FkaW5nTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRsb2FkYWJsZUNvbXBsZXRlJywgbG9hZGFibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9hZGFibGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgYWxsIHJlcXVpcmVkIGl0ZW1zXG4gICAqIFxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBjYWxsYmFjaywgZnVuY3Rpb24oZXJyKVxuICAgKi9cbiAgdmFyIF9sb2FkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgY3VycmVudCA9ICRzdGF0ZS5jdXJyZW50KCk7XG5cbiAgICAvLyBFdmFsdWF0ZVxuICAgIGlmKGN1cnJlbnQpIHtcbiAgICAgIHZhciBzb3VyY2VzID0gKHR5cGVvZiBjdXJyZW50LmxvYWQgPT09ICdzdHJpbmcnID8gW2N1cnJlbnQubG9hZF0gOiBjdXJyZW50LmxvYWQpIHx8IFtdO1xuICAgICAgXG4gICAgICAvLyBHZXQgcHJvbWlzZXNcbiAgICAgICRxLmFsbChzb3VyY2VzLm1hcChmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgcmV0dXJuIF9jcmVhdGVMb2FkYWJsZShzcmMpLnByb21pc2U7XG4gICAgICB9KSlcbiAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRsb2FkYWJsZUVycm9yJywgZXJyKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgfSk7XG5cbiAgICAvLyBObyBzdGF0ZVxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbG9hZGFibGUsIGdldCByZWZlcmVuY2UgdG8gZXhpc3RpbmcgbWV0aG9kc1xuICAgKi9cbiAgX3NlbGYuZ2V0ID0gX2NyZWF0ZUxvYWRhYmxlO1xuXG4gIC8qKlxuICAgKiBHZXQgcHJvZ3Jlc3NcbiAgICogXG4gICAqIEByZXR1cm4ge051bWJlcn0gQSBudW1iZXIgMC4uMSBkZW5vdGluZyBjdXJyZW50IHByb2dyZXNzXG4gICAqL1xuICBfc2VsZi5wcm9ncmVzcyA9IF9nZXRQcm9ncmVzcztcblxuICAvKipcbiAgICogUmVhZHlcbiAgICovXG4gIF9zZWxmLiRyZWFkeSA9IGZ1bmN0aW9uKCkge1xuICAgIF9oZWFkID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKSlbMF07XG4gIH07XG5cbiAgLy8gUmVnaXN0ZXIgbWlkZGxld2FyZSBsYXllclxuICAkc3RhdGUuJHVzZShmdW5jdGlvbihyZXF1ZXN0LCBuZXh0KSB7XG4gICAgX2xvYWQobmV4dCk7XG4gIH0sIDEpO1xuXG4gIHJldHVybiBfc2VsZjtcbn1dO1xuIl19
