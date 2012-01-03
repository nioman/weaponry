/**
 *  WeaponryConsolesService.js
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

function WeaponryConsolesService() {
	// pass
}

WeaponryConsolesService.prototype = {
	classDescription: 'Weaponry Consoles Service',
	classID: Components.ID('{608c7690-558e-11e0-b8af-0800200c9a66}'),
	contractID: '@consoles.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryConsolesService]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	executeConsoleCommand: function (console, command, args, handler, context) {
		let launchers = weaponryCommon.retrieveComponents('weaponry-consoles-command-launchers', 'IWeaponryConsolesCommandLauncher');
		let launchersLength = launchers.length;
		
		let i;
		let launcher;
		
		for (i = 0; i < launchersLength; i += 1) {
			launcher = launchers[i];
			
			if (launcher.supportsConsole(console) && launcher.supportsCommand(command)) {
				launcher.executeConsoleCommand(console, command, args, handler, context);
				
				return;
			}
		}
		
		throw new Error('unsupported command ' + command);
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryConsolesService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/