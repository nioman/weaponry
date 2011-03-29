/**
 *  WeaponryCommonService.js
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

const CHROMEBASE = 'common.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryCommonService() {
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
}

WeaponryCommonService.prototype = {
	classDescription: 'Weaponry Common Service',
	classID: Components.ID('{3041d510-84fc-11df-8395-0800200c9a66}'),
	contractID: '@common.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryCommonService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	_xpcom_categories: [
		{service:true, entry:'WeaponryCommonService', category:'app-startup'}
	],
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function (subject, topic, data) {
		if (topic == 'app-startup') {
			this.observerService.addObserver(this, 'profile-after-change', false);
			this.observerService.addObserver(this, 'profile-before-change', false);
		} else
		if (topic == 'profile-after-change') {
			this.initializeComponent(subject, topic, data);
		} else
		if (topic == 'profile-before-change') {
			this.deinitializeComponent(subject, topic, data);
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		// pass
	},
	
	deinitializeComponent: function (subject, topic, data) {
		// pass
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryCommonService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryCommonService]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/