/**  
 *  WeaponryAboutModule.js
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
 **/

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryAboutModule() {
	// pass
}

WeaponryAboutModule.prototype = {
	classDescription: 'Weaponry About Module',
	classID: Components.ID('{409929c0-aae1-434b-a843-fb8640f510fa}'),
	contractID: '@mozilla.org/network/protocol/about;1?what=weaponry',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryAboutModule, CI.nsIAboutModule]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	getURIFlags: function(uri) {
		return CI.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT;
	},
	
	newChannel: function(uri) {
		let ioService = CC['@mozilla.org/network/io-service;1'].getService(CI.nsIIOService);
		let channel = ioService.newChannel('chrome://org.gnucitizen.weaponry.support/content/htm/about.htm', null, null);
		
		channel.originalURI = uri;
		
		return channel;
	}
}

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryAboutModule]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/