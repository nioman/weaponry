/**
 *  common.js
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

function log() {
	if (arguments.length == 0) {
		throw new Error('no arguments provided');
	}
	
	if (arguments[0] instanceof HTMLElement || arguments[0] instanceof SVGElement || arguments[0] instanceof XULElement) {
		weaponryCommon.logElement.apply(weaponryCommon, arguments);
	} else
	if (weaponryCommon.isString(arguments[0])) {
		weaponryCommon.logString.apply(weaponryCommon, arguments);
	} else {
		weaponryCommon.logObject.apply(weaponryCommon, arguments);
	}
}

/* ------------------------------------------------------------------------ */

installHandler('org.gnucitizen.weaponry.development.common', {
	onLoad: function (event) {
		if (event.target != document) {
			return;
		}
		
		if (weaponryCommon.getPref('toolkit.defaultChromeURI') == document.location && weaponryCommon.getPref('org.gnucitizen.weaponry.development.warn') == true) {
			let $stringbundle = document.getElementById('weaponry-development-common-stringbundle');
			
			setTimeout(function () {
				let result = alertCheck($stringbundle.getString('development-extension-enabled-notification-message'), $stringbundle.getString('development-extension-enabled-do-not-warn-message'));
				
				if (result.value == true) {
					weaponryCommon.setPref('org.gnucitizen.weaponry.development.warn', false);
				}
			}, 1000);
		}
	}
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/