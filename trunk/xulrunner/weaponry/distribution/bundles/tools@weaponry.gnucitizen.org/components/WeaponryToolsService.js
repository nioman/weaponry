/**
 *  WeaponryToolsService.js
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

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

const CHROMEBASE = 'tools.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryToolsService() {
	// pass
}

WeaponryToolsService.prototype = {
	classDescription: 'Weaponry Tools Service',
	classID: Components.ID('{c2621b40-e027-11df-85ca-0800200c9a66}'),
	contractID: '@tools.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryToolsService]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	openToolsWindow: function () {
		let windowMediator = CC['@mozilla.org/appshell/window-mediator;1'].getService(CI.nsIWindowMediator);
		let window = windowMediator.getMostRecentWindow(CHROMEBASE + ':tools-window');
		
		if (window) {
			window.focus();
			
			return window;
		}
		
		let windowWatcher = CC['@mozilla.org/embedcomp/window-watcher;1'].getService(CI.nsIWindowWatcher);
		
		return windowWatcher.openWindow(null, 'chrome://' + CHROMEBASE + '/content/xul/toolsWindow.xul', null, 'all,chrome,resizable', null);
	},
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryToolsService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryToolsService]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/