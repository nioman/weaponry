/**
 *  express.js
 *  Copyright (C) 2007-2011  GNUCITIZEN
 *  
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

(function (window) {
	let events = ['command', 'click'];
	let eventsLength = events.length;
	
	for (let i = 0; i < eventsLength; i += 1) {
		let event = events[i];
		
		window['bind' + (event.charAt(0).toUpperCase() + event.slice(1)) + 'Event'] = (function (event) {
			return function (id, handler) {
				let $element = document.getElementById(id);
				
				if (!$element) {
					throw new Error('cannot find element with id ' + id);
				}
				
				$element.addEventListener(event, handler, false);
			};
		})(event);
	}
})(window);

/* ------------------------------------------------------------------------ */

function createNamespace(namespace, gadget, bindEvents) {
	let subject = window;
	let spaces = namespace.split('.');
	let spacesLength = spaces.length;
	
	for (let i = 0; i < spacesLength; i += 1) {
		let space = spaces[i];
		
		if (!Object.hasOwnProperty(subject, space)) {
			subject[space] = {};
		}
		
		if (i == spacesLength - 1 && gadget != undefined) {
			subject[space] = gadget;
		}
		
		subject = subject[space];
	}
	
	if (gadget != undefined) {
		if (bindEvents != undefined && bindEvents) {
			let events = {
				'onDOMContentLoaded': 'DOMContentLoaded',
				'onLoad': 'load',
				'onUnload': 'unload',
				'onClose': 'close'
			};
			
			for (let handler in events) {
				if (handler in subject) {
					addEventListener(events[handler], subject[handler], false);
				}
			}
		}
	}
	
	return subject;
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/