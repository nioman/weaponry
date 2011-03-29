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

const CHROMEBASE = 'development.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryDevelopmentService() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
}

WeaponryDevelopmentService.prototype = {
	classDescription: 'Weaponry Development Service',
	classID: Components.ID('{20d3e960-3277-11df-9aae-0800200c9a66}'),
	contractID: '@development.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryDevelopmentService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	_xpcom_categories: [
		{service:true, entry:'WeaponryPreferencesService', category:'app-startup'}
	],
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function (subject, topic, data) {
		if (topic == 'app-startup') {
			weaponryCommon.observerService.addObserver(this, 'profile-after-change', false);
			weaponryCommon.observerService.addObserver(this, 'profile-before-change', false);
		} else
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

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryDevelopmentService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryDevelopmentService]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/