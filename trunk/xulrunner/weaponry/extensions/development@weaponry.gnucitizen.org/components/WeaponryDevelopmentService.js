/**
 *  WeaponryDevelopmentService.js
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

function WeaponryDevelopmentService() {
	// pass
}

WeaponryDevelopmentService.prototype = {
	classDescription: 'Weaponry Development Service',
	classID: Components.ID('{3ce142e4-ddbc-49d3-a262-a855bf2da226}'),
	contractID: '@development.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryDevelopmentService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function (subject, topic, data) {
		if (topic == 'profile-after-change') {
			this.initializeComponent(subject, topic, data);
		} else
		if (topic == 'profile-before-change') {
			this.deinitializeComponent(subject, topic, data);
		} else
		if (topic == 'final-ui-startup') {
			this.updateUI();
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		weaponryCommon.observerService.addObserver(this, 'final-ui-startup', false);
	},
	
	deinitializeComponent: function (subject, topic, data) {
		weaponryCommon.observerService.removeObserver(this, 'final-ui-startup');
	},
	
	/* -------------------------------------------------------------------- */
	
	updateUI: function () {
		if (weaponryCommon.getPref('org.gnucitizen.weaponry.development.openErrorConsoleOnStartup')) {
			weaponryCommon.openErrorConsoleWindow();
		}
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryDevelopmentService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/