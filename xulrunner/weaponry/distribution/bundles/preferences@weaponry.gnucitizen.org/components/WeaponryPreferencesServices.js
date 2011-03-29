/**
 *  WeaponryPreferencesService.js
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

const CHROMEBASE = 'preferences.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryPreferencesService() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
}

WeaponryPreferencesService.prototype = {
	classDescription: 'Weaponry Preferences Service',
	classID: Components.ID('{2711ef90-08f9-11df-8a39-0800200c9a66}'),
	contractID: '@preferences.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryPreferencesService, CI.nsIObserver]),
	
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
			this.updatePreferences();
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
	
	updatePreferences: function () {
		weaponryCommon.setPref('browser.preferences.animateFadeIn', weaponryCommon.xulAppInfo.OS == 'Darwin');
	},
	
	/* -------------------------------------------------------------------- */
	
	updateProxySettings: function (enable, host, port, types) {
		if (enable) {
			weaponryCommon.setPref('network.proxy.type', 1);
		} else {
			weaponryCommon.setPref('network.proxy.type', 0);
		}
		
		// TODO: take into consideration types
		weaponryCommon.setPref('network.proxy.share_proxy_settings', true);
		//
		
		if (host) {
			weaponryCommon.setPref('network.proxy.http', host);
		}
		
		if (port) {
			weaponryCommon.setPref('network.proxy.http_port', port);
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	openPreferencesWindow: function () {
		// TODO: ensure that all similar components have the same window flags when opening dialogs
		return weaponryCommon.openWindowOnce(null, CHROMEBASE + ':preferences-prefwindow', 'chrome://' + CHROMEBASE + '/content/xul/preferencesPrefwindow.xul', null, 'all,chrome,centerscreen,dialog=yes');
		//
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryPreferencesService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryPreferencesService]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/