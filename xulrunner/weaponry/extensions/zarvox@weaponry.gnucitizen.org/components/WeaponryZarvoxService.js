/**
 *  WeaponryZarvoxService.js
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

const CHROMEBASE = 'zarvox.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryZarvoxService() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
	
	this.greetings = [
		'Websecurify, the future of web security.',
		'Rock on!',
		'Let\'s do it!',
	];
}

WeaponryZarvoxService.prototype = {
	classDescription: 'Weaponry Zarvox Service',
	classID: Components.ID('{da10e180-5d15-11df-a08a-0800200c9a66}'),
	contractID: '@zarvox.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryZarvoxService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	_xpcom_categories: [
		{service:true, entry:'WeaponryZarvoxService', category:'app-startup'}
	],
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function(subject, topic, data) {
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
			this.greetUser();
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
	
	greetUser: function () {
		this.sayText(this.greetings[Math.floor(Math.random() * this.greetings.length)]);
	},
	
	/* -------------------------------------------------------------------- */
	
	sayText: function (text) {
		switch (weaponryCommon.xulAppInfo.OS) {
			case 'Darwin':
				weaponryCommon.executeFile('/usr/bin/osascript', weaponryCommon.getChromeUriFilePath('chrome://' + CHROMEBASE + '/content/bin/sayText.scpt'), text); 
				break;
			case 'Linux':
				break;
			case 'WINNT':
				break;
		}
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryZarvoxService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryZarvoxService]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/