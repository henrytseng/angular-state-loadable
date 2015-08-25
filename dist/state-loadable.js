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

  .factory('$loadableManager', require('./services/loadable-manager'));

},{"./services/loadable-manager":2}],2:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaGVucnkvSG9tZVN5bmMvQ2FudmFzL3Byb2plY3RzL2FuZ3VsYXItc3RhdGUtbG9hZGFibGUvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2hlbnJ5L0hvbWVTeW5jL0NhbnZhcy9wcm9qZWN0cy9hbmd1bGFyLXN0YXRlLWxvYWRhYmxlL3NyYy9zZXJ2aWNlcy9sb2FkYWJsZS1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7O0FBS0EsSUFBSSxPQUFPLFdBQVcsZUFBZSxPQUFPLFlBQVksZUFBZSxPQUFPLFlBQVksUUFBUTtFQUNoRyxPQUFPLFVBQVU7Ozs7OztBQU1uQixRQUFRLE9BQU8sMEJBQTBCLENBQUM7O0dBRXZDLFFBQVEsb0JBQW9CLFFBQVE7QUFDdkM7O0FDZkE7Ozs7QUFJQSxPQUFPLFVBQVUsQ0FBQyxVQUFVLE1BQU0sYUFBYSxjQUFjLFNBQVMsUUFBUSxJQUFJLFdBQVcsWUFBWTs7O0VBR3ZHLElBQUksUUFBUTs7O0VBR1osSUFBSSxnQkFBZ0I7OztFQUdwQixJQUFJLGVBQWU7RUFDbkIsSUFBSSxpQkFBaUI7Ozs7Ozs7RUFPckIsSUFBSSxZQUFZLFNBQVMsT0FBTyxLQUFLOztJQUVuQyxJQUFJLFlBQVk7O01BRWQsT0FBTzs7TUFFUCxLQUFLOzs7TUFHTCxZQUFZOztNQUVaLFNBQVMsR0FBRzs7TUFFWixVQUFVLFVBQVUsY0FBYzs7Ozs7SUFLcEMsSUFBSSxRQUFRLFVBQVUscUJBQXFCLFFBQVEsTUFBTSxVQUFVO0lBQ25FLFVBQVUsU0FBUyxNQUFNO0lBQ3pCLFVBQVUsU0FBUyxPQUFPO0lBQzFCLFVBQVUsU0FBUyxRQUFRO0lBQzNCLE1BQU0sYUFBYSxVQUFVLFVBQVUsTUFBTTs7O0lBRzdDLGFBQWEsS0FBSzs7O0lBR2xCLFVBQVUsU0FBUyxTQUFTLFVBQVUsU0FBUyxxQkFBcUIsV0FBVzs7TUFFN0UsR0FBRyxDQUFDLFVBQVUsZUFBZSxDQUFDLEtBQUssY0FBYyxLQUFLLGVBQWUsWUFBWSxLQUFLLGVBQWUsYUFBYTtRQUNoSCxVQUFVLGFBQWE7UUFDdkIsVUFBVSxTQUFTLFNBQVMsVUFBVSxTQUFTLHFCQUFxQjs7UUFFcEUsR0FBRyxTQUFTLFVBQVUsU0FBUyxZQUFZO1VBQ3pDLE1BQU0sWUFBWSxVQUFVOzs7O1FBSTlCLElBQUksSUFBSSxhQUFhLFFBQVE7UUFDN0IsR0FBRyxNQUFNLENBQUMsR0FBRztVQUNYLGFBQWEsT0FBTyxHQUFHOztRQUV6QixlQUFlLEtBQUs7O1FBRXBCLFVBQVUsUUFBUSxRQUFROzs7O0lBSTlCLE9BQU87Ozs7Ozs7O0VBUVQsSUFBSSxlQUFlLFdBQVc7SUFDNUIsSUFBSSxTQUFTLGFBQWE7SUFDMUIsSUFBSSxRQUFRLGFBQWEsU0FBUyxlQUFlO0lBQ2pELE9BQU8sS0FBSyxJQUFJLEdBQUcsS0FBSyxJQUFJLEdBQUcsT0FBTzs7Ozs7Ozs7OztFQVV4QyxJQUFJLGtCQUFrQixTQUFTLE9BQU8sS0FBSztJQUN6QyxJQUFJOzs7SUFHSixHQUFHLENBQUMsU0FBUyxVQUFVLElBQUk7TUFDekIsSUFBSTtNQUNKLFFBQVEsSUFBSSxNQUFNO01BQ2xCLE1BQU0sT0FBTztNQUNiLE1BQU07Ozs7SUFJUixHQUFHLGNBQWMsUUFBUTtNQUN2QixXQUFXLGNBQWM7OztXQUdwQjs7TUFFTCxXQUFXLElBQUksVUFBVSxPQUFPO01BQ2hDLGNBQWMsU0FBUzs7O01BR3ZCLFdBQVcsV0FBVyxvQkFBb0I7TUFDMUMsV0FBVyxXQUFXLHFCQUFxQjs7O01BRzNDLFNBQVMsUUFBUSxLQUFLLFdBQVc7OztRQUcvQixXQUFXLFdBQVcscUJBQXFCO1FBQzNDLEdBQUcsYUFBYSxXQUFXLEdBQUc7VUFDNUIsV0FBVyxXQUFXLHFCQUFxQjs7Ozs7SUFLakQsT0FBTzs7Ozs7Ozs7O0VBU1QsSUFBSSxlQUFlLFNBQVMsT0FBTztJQUNqQyxPQUFPLGNBQWM7Ozs7OztFQU12QixNQUFNLFNBQVM7Ozs7O0VBS2YsTUFBTSxNQUFNOzs7Ozs7O0VBT1osTUFBTSxXQUFXOzs7RUFHakIsT0FBTyxLQUFLLFNBQVMsU0FBUyxNQUFNO0lBQ2xDOzs7RUFHRixPQUFPOztBQUVUIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIGFuZ3VsYXI6ZmFsc2UgKi9cblxuLy8gQ29tbW9uSlNcbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzID09PSBleHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSAnYW5ndWxhci1zdGF0ZS1sb2FkYWJsZSc7XG59XG5cbi8vIEFzc3VtZSBwb2x5ZmlsbCB1c2VkIGluIFN0YXRlUm91dGVyIGV4aXN0c1xuXG4vLyBJbnN0YW50aWF0ZSBtb2R1bGVcbmFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyLXN0YXRlLWxvYWRhYmxlJywgWydhbmd1bGFyLXN0YXRlLXJvdXRlciddKVxuXG4gIC5mYWN0b3J5KCckbG9hZGFibGVNYW5hZ2VyJywgcmVxdWlyZSgnLi9zZXJ2aWNlcy9sb2FkYWJsZS1tYW5hZ2VyJykpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBnbG9iYWwgcHJvY2VzczpmYWxzZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFsnJHN0YXRlJywgJyRxJywgJyRkb2N1bWVudCcsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHN0YXRlLCAkcSwgJGRvY3VtZW50LCAkcm9vdFNjb3BlKSB7XG5cbiAgLy8gSW5zdGFuY2VcbiAgdmFyIF9zZWxmID0ge307XG5cbiAgLy8gTGlicmFyeVxuICB2YXIgX2xvYWRhYmxlSGFzaCA9IHt9O1xuXG4gIC8vIFByb2dyZXNzXG4gIHZhciBfbG9hZGluZ0xpc3QgPSBbXTtcbiAgdmFyIF9jb21wbGV0ZWRMaXN0ID0gW107XG5cbiAgLyoqXG4gICAqIEEgbG9hZGVkIHJlc291cmNlLCBhZGRzIHNlbGYgdG8gRE9NLCBzZWxmIG1hbmFnZSBwcm9ncmVzc1xuICAgKiBcbiAgICogQHJldHVybiB7X0xvYWRhYmxlfSBBbiBpbnN0YW5jZVxuICAgKi9cbiAgdmFyIF9Mb2FkYWJsZSA9IGZ1bmN0aW9uKHN0YXRlLCBzcmMpIHtcbiAgICAvLyBJbnN0YW5jZVxuICAgIHZhciBfbG9hZGFibGUgPSB7XG5cbiAgICAgIHN0YXRlOiBzdGF0ZSxcblxuICAgICAgc3JjOiBzcmMsXG5cbiAgICAgIC8vIExvYWRpbmcgY29tcGxldGlvbiBmbGFnXG4gICAgICBpc0NvbXBsZXRlOiBmYWxzZSxcblxuICAgICAgcHJvbWlzZTogJHEuZGVmZXIoKSxcblxuICAgICAgJGVsZW1lbnQ6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuXG4gICAgfTtcblxuICAgIC8vIEJ1aWxkIERPTSBlbGVtZW50XG4gICAgdmFyIF9oZWFkID0gJGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSB8fCAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIF9sb2FkYWJsZS4kZWxlbWVudC5zcmMgPSBzcmM7XG4gICAgX2xvYWRhYmxlLiRlbGVtZW50LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICBfbG9hZGFibGUuJGVsZW1lbnQuYXN5bmMgPSBmYWxzZTtcbiAgICBfaGVhZC5pbnNlcnRCZWZvcmUoX2xvYWRhYmxlLiRlbGVtZW50LCBfaGVhZC5maXJzdENoaWxkKTtcblxuICAgIC8vIE1hcmsgbG9hZGluZyBpbiBwcm9ncmVzc1xuICAgIF9sb2FkaW5nTGlzdC5wdXNoKF9sb2FkYWJsZSk7XG5cbiAgICAvLyBDb21wbGV0aW9uXG4gICAgX2xvYWRhYmxlLiRlbGVtZW50Lm9ubG9hZCA9IF9sb2FkYWJsZS4kZWxlbWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgaWYoIV9sb2FkYWJsZS5pc0NvbXBsZXRlICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikpIHtcbiAgICAgICAgX2xvYWRhYmxlLmlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICBfbG9hZGFibGUuJGVsZW1lbnQub25sb2FkID0gX2xvYWRhYmxlLiRlbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZihfaGVhZCAmJiBfbG9hZGFibGUuJGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIF9oZWFkLnJlbW92ZUNoaWxkKF9sb2FkYWJsZS4kZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYXJrIGNvbXBsZXRlXG4gICAgICAgIHZhciBpID0gX2xvYWRpbmdMaXN0LmluZGV4T2YoX2xvYWRhYmxlKTtcbiAgICAgICAgaWYoaSAhPT0gLTEpIHtcbiAgICAgICAgICBfbG9hZGluZ0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICAgIF9jb21wbGV0ZWRMaXN0LnB1c2goX2xvYWRhYmxlKTtcblxuICAgICAgICBfbG9hZGFibGUucHJvbWlzZS5yZXNvbHZlKF9sb2FkYWJsZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfbG9hZGFibGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBwcm9ncmVzc1xuICAgKiBcbiAgICogQHJldHVybiB7TnVtYmVyfSBBIG51bWJlciAwLi4xIGRlbm90aW5nIHByb2dyZXNzXG4gICAqL1xuICB2YXIgX2dldFByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvYWRlZCA9IF9sb2FkaW5nTGlzdC5sZW5ndGg7XG4gICAgdmFyIHRvdGFsID0gX2xvYWRpbmdMaXN0Lmxlbmd0aCArIF9jb21wbGV0ZWRMaXN0Lmxlbmd0aDtcbiAgICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgbG9hZGVkL3RvdGFsKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIF9Mb2FkYWJsZS4gIERvZXMgbm90IHJlcGxhY2UgcHJldmlvdXNseSBjcmVhdGVkIGluc3RhbmNlcy4gIFxuICAgKiBcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgc3RhdGUgQSBzdGF0ZSBuYW1lXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIHNyYyAgIEEgc291cmNlIHBhdGggZm9yIHNjcmlwdCBhc3NldFxuICAgKiBAcmV0dXJuIHtfTG9hZGFibGV9ICAgICAgQSBsb2FkYWJsZSBpbnN0YW5jZVxuICAgKi9cbiAgdmFyIF9jcmVhdGVMb2FkYWJsZSA9IGZ1bmN0aW9uKHN0YXRlLCBzcmMpIHtcbiAgICB2YXIgbG9hZGFibGU7XG5cbiAgICAvLyBWYWxpZCBzdGF0ZSBuYW1lIHJlcXVpcmVkXG4gICAgaWYoIXN0YXRlIHx8IHN0YXRlID09PSAnJykge1xuICAgICAgdmFyIGVycm9yO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ0xvYWRhYmxlIHJlcXVpcmVzIGEgdmFsaWQgc3RhdGUgbmFtZS4nKTtcbiAgICAgIGVycm9yLmNvZGUgPSAnaW52YWxpZG5hbWUnO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgLy8gQWxyZWFkeSBleGlzdHNcbiAgICBpZihfbG9hZGFibGVIYXNoW3N0YXRlXSkge1xuICAgICAgbG9hZGFibGUgPSBfbG9hZGFibGVIYXNoW3N0YXRlXTtcblxuICAgIC8vIENyZWF0ZSBuZXdcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ3JlYXRlIG5ldyBpbnN0YW5jZVxuICAgICAgbG9hZGFibGUgPSBuZXcgX0xvYWRhYmxlKHN0YXRlLCBzcmMpO1xuICAgICAgX2xvYWRhYmxlSGFzaFtzdGF0ZV0gPSBsb2FkYWJsZTtcblxuICAgICAgLy8gQnJvYWRjYXN0IGNyZWF0aW9uLCBwcm9ncmVzc1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckbG9hZGFibGVDcmVhdGVkJywgbG9hZGFibGUpO1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckbG9hZGFibGVQcm9ncmVzcycsIF9nZXRQcm9ncmVzcygpKTtcblxuICAgICAgLy8gQ29tcGxldGlvblxuICAgICAgbG9hZGFibGUucHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIEJyb2FkY2FzdCBjb21wbGV0ZVxuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRsb2FkYWJsZVByb2dyZXNzJywgX2dldFByb2dyZXNzKCkpO1xuICAgICAgICBpZihfbG9hZGluZ0xpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckbG9hZGFibGVDb21wbGV0ZScsIGxvYWRhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvYWRhYmxlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgbG9hZGFibGUsIGlmIGRvZXMgbm90IGV4aXN0IGNyZWF0ZVxuICAgKiBcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgc3RhdGUgQSBzdGF0ZSBuYW1lXG4gICAqIEByZXR1cm4ge19Mb2FkYWJsZX0gICAgICBBIGxvYWRhYmxlIGluc3RhbmNlXG4gICAqL1xuICB2YXIgX2dldExvYWRhYmxlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICByZXR1cm4gX2xvYWRhYmxlSGFzaFtzdGF0ZV07XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGxvYWRhYmxlLCBnZXQgcmVmZXJlbmNlIHRvIGV4aXN0aW5nIG1ldGhvZHNcbiAgICovXG4gIF9zZWxmLmNyZWF0ZSA9IF9jcmVhdGVMb2FkYWJsZTtcblxuICAvKipcbiAgICogR2V0IGEgbG9hZGFibGVcbiAgICovXG4gIF9zZWxmLmdldCA9IF9nZXRMb2FkYWJsZTtcblxuICAvKipcbiAgICogR2V0IHByb2dyZXNzXG4gICAqIFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEEgbnVtYmVyIDAuLjEgZGVub3RpbmcgY3VycmVudCBwcm9ncmVzc1xuICAgKi9cbiAgX3NlbGYucHJvZ3Jlc3MgPSBfZ2V0UHJvZ3Jlc3M7XG5cbiAgLy8gUmVnaXN0ZXIgbWlkZGxld2FyZSBsYXllclxuICAkc3RhdGUuJHVzZShmdW5jdGlvbihyZXF1ZXN0LCBuZXh0KSB7XG4gICAgbmV4dCgpO1xuICB9KTtcblxuICByZXR1cm4gX3NlbGY7XG59XTtcbiJdfQ==
