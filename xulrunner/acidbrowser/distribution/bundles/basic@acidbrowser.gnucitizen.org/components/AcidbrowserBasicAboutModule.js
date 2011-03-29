/**  
 *  AcidbrowserBasicAboutModule.js
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

const CHROMEBASE = 'basic.acidbrowser.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function AcidbrowserBasicAboutModule() {
	// pass
}

AcidbrowserBasicAboutModule.prototype = {
	classDescription: 'Acidbrowser Basic About Module',
	classID: Components.ID('{187ddc80-4f04-11e0-b8af-0800200c9a66}'),
	contractID: '@mozilla.org/network/protocol/about;1?what=acidbrowser',
	QueryInterface: XPCOMUtils.generateQI([CI.IAcidbrowserBasicAboutModule, CI.nsIAboutModule]),
	
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
		let channel = ioService.newChannel('chrome://' + CHROMEBASE + '/content/htm/aboutAcidbrowser.htm', null, null);
		
		channel.originalURI = uri;
		
		return channel;
	},
}

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([AcidbrowserBasicAboutModule]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([AcidbrowserBasicAboutModule]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/