'use strict';

/* global process:false */

var events = require('events');

function Loadable() {

}

module.exports = [function() {


  // Return instance
  return {

    /**
     * Factory method
     * 
     * @return {Loadable} An instance of Loadable
     */
    create: function() {
      return new Loadable();
    }

  };
}];
