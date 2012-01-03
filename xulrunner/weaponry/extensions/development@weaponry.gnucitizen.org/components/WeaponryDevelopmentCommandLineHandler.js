/**
 *  WeaponryDevelopmentCommandLineHandler.js
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

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
Components.utils.import('resource://org.gnucitizen.weaponry.common/content/mod/weaponryCommon.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryDevelopmentCommandLineHandler() {
	// pass
}

WeaponryDevelopmentCommandLineHandler.prototype = {
	classDescription: 'Weaponry Development Command Line Handler',
	classID: Components.ID('{31a09f50-fab4-49e4-97d4-a994e8a6375f}'),
	contractID: '@development.weaponry.gnucitizen.org/command-line-handler;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryDevelopmentCommandLineHandler, CI.nsICommandLineHandler, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	helpInfo: '  -disabledevelopmentwarning     Start Weaponry development test\n',
	
	/* -------------------------------------------------------------------- */
	
	handle: function (commandLine) {
		let parameter = commandLine.handleFlag('disabledevelopmentwarning', false);
		
		if (!parameter) {
			return;
		}
		
		weaponryCommon.setPref('org.gnucitizen.weaponry.development.warn', false);
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryDevelopmentCommandLineHandler]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/