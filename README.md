StateLoadable
=============

[![Build Status](https://travis-ci.org/henrytseng/angular-state-loadable.svg?branch=master)](https://travis-ci.org/henrytseng/angular-state-loadable) [![Join the chat at https://gitter.im/henrytseng/angular-state-router](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/henrytseng/angular-state-router?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) 

A lightweight and flexible AngularJS lazy loading scheme.

StateLoadable is a modular component designed to be used with [StateRouter](https://www.npmjs.com/package/angular-state-router), an AngularJS state-based router.  



Install
-------

To install in your project, install from npm (remember you'll also need to install angular-state-router since it is a dependency)

	npm install angular-state-loadable --save



Quick Start
-----------

Include the `state-loadable.min.js` script tag in your `.html`:

	<html ng-app="myApp">
	  <head>
	    <script src="/node_modules/angular/angular.min.js"></script>
	    <script src="/node_modules/angular-state-router/dist/state-router.min.js"></script>
	    <script src="/node_modules/angular-state-loadable/dist/state-loadable.min.js"></script>
	    <script src="/js/app.js"></script>
	  </head>
	  <body>
	    ...
	  </body>
	</html>

In `app.js` add `angular-state-router` and `angular-state-loadable` as a dependency when your application module is instantiated.  

	var myApp = angular.module('myApp', ['angular-state-router', 'angular-state-loadable']);

During the configuration of StateRouter utilize the parameter `load` to associate a script file to lazy load.  Loadables will only load once, that is, the first time that they are needed.  

	myApp
	  .config(function($stateProvider) {
	    $stateProvider
	        .state('search', {
	          url: '/search',
	          
	          // An Array of files or a single file name String
	          load: ['components/search.js']
	          
	        });
	  });

Where `components.search.js` is the following file:

	myApp
	  .controller('SearchController', function() {
	    // ...
	  });

StateLoadable is meant to be flexible and therefore does not impose any scheme for registering angular components (directives, controllers, filters, services, providers, and/or ... etc.)  

We suggest using the scheme in the example code for late registration of these components.  

Remember that `$stateProvider` is different from `$state`.  



Events
------

Events are broadcast on the `$rootScope`.  


### $loadableCreated

This event is emitted when a loadable object starts loading.  



### $loadableProgress

This event is emitted when a loadable object progresses loading.  This event must occur once before `'end'` is emitted.  



### $loadableComplete

This event is emitted when a loadable object completes loading.  



### $loadableError

This event is emitted when an error occurred during loading of a loadable.  



License
-------

Copyright (c) 2015 Henry Tseng

Released under the MIT license. See LICENSE for details.