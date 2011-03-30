/**
 *  WeaponryViewersService.js
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

const CHROMEBASE = 'viewers.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryViewersService() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
}

WeaponryViewersService.prototype = {
	classDescription: 'Weaponry Viewers Service',
	classID: Components.ID('{6359d724-3af8-49fc-84a6-82cd842b258d}'),
	contractID: '@viewers.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryViewersService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	_xpcom_categories: [
		{service:true, entry:'WeaponryViewersService', category:'app-startup'}
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
		// pass
	},
	
	deinitializeComponent: function (subject, topic, data) {
		// pass
	},
	
	/* -------------------------------------------------------------------- */
	
	registerContentViewer: function (mimeType, uri) {
		let contentConverter = CC['@viewers.weaponry.gnucitizen.org/content-converter;1'];
		let classID = Components.ID(contentConverter.number);
		
		let factory = {
			createInstance: function (outer, iid) {
				let instance = weaponryCommon.componentManager.createInstanceByContractID('@viewers.weaponry.gnucitizen.org/content-converter;1', outer, iid);
				
				instance.QueryInterface(CI.IWeaponryViewersContentConverter);
				instance.initWithUri(uri);
				
				return instance;
			}
		};
		
		weaponryCommon.componentManager.registerFactory(classID, 'Weaponry Viewers Content Converter for ' + mimeType, '@mozilla.org/streamconv;1?from=' + mimeType + '&to=*/*', factory, false);
	},
	
	unregisterContentViewer: function (mimeType, uri) {
		// NOTE: not implemented
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryViewersService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryViewersService]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/