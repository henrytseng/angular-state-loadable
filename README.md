StateLoadable
=============

[![Build Status](https://travis-ci.org/henrytseng/angular-state-loadable.svg?branch=master)](https://travis-ci.org/henrytseng/angular-state-loadable) [![Join the chat at https://gitter.im/henrytseng/angular-state-router](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/henrytseng/angular-state-router?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) 

An AngularJS lazy loading.  

StateLoadable is a modular component designed to be used with [StateRouter](https://www.npmjs.com/package/angular-state-router), an AngularJS state-based router.  



Install
-------

To install in your project, install from npm (remember you'll also need to install angular-state-router since it is a dependency)

	npm install angular-state-loadable --save








Events
------

Events are emit from $state; where $state inherits from [events.EventEmitter](https://nodejs.org/api/events.html).  

To listen to events 

	$state.on('load:start', function() {
		// ...
	});



Event: 'load:start'
-------------------

This event is emitted when a loadable object starts loading.  



Event: 'load:progress'
----------------------

This event is emitted when a loadable object progresses loading.  This event must occur once before `'end'` is emitted.  



Event: 'load:end'
-----------------

This event is emitted when a loadable object completes loading.  



Event: 'error'
--------------

* `request` *Object* Requested data `{ name: 'nextState', params: {} }`

This event is emitted whenever an error occurs.  



Event: 'error:load'
-------------------

This event is emitted when an error occurred during loading of a loadable.  



License
-------

Copyright (c) 2015 Henry Tseng

Released under the MIT license. See LICENSE for details.