/**
 *  Service.js
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

const CHROMEBASE = 'acidbrowser.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function Service() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
}

Service.prototype = {
	classDescription: 'Service',
	classID: Components.ID('{a91a2ebc-8bef-4515-aba9-ba093869d048}'),
	contractID: 'service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	_xpcom_categories: [
		{service:true, entry:'service', category:'app-startup'}
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
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		weaponryCommon.getService('@browser.weaponry.gnucitizen.org/service;1', 'IWeaponryBrowserService').registerDefaultContentHandlers();
	},
	
	deinitializeComponent: function (subject, topic, data) {
		// pass
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([Service]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([Service]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/