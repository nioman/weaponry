/**
 *  WeaponryWorkspacesAutocomplete.js
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

const CHROMEBASE = 'workspaces.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryWorkspacesAutocomplete() {
	this.workspacesService = CC['@workspaces.weaponry.gnucitizen.org/service;1'].getService(CI.IWeaponryWorkspacesService);
}

WeaponryWorkspacesAutocomplete.prototype = {
	classDescription: 'Weaponry Workspaces Autocomplete',
	classID: Components.ID('{632029b0-099a-11df-8a39-0800200c9a66}'),
	contractID: '@mozilla.org/autocomplete/search;1?name=weaponry-workspaces',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryWorkspacesAutocomplete, CI.nsIAutoCompleteSearch]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	startSearch: function(search, parameters, result, listener) {
		let matches = [];
		let enumerator = this.workspacesService.enumerateWorkspaces();
		
		while (enumerator.hasMoreElements()) {
			let name = enumerator.getNext().QueryInterface(CI.IWeaponryWorkspace).name;
			
			if (search.toLowerCase() == name.toLowerCase().substring(0, search.length)) {
				matches.push(name);
			}
		}
		
		let handler = {
			searchString: search,
			searchResult: matches.length > 0 ? CI.nsIAutoCompleteResult.RESULT_SUCCESS : CI.nsIAutoCompleteResult.RESULT_NOMATCH,
			defaultIndex: 0,
			errorDescription: null,
			matchCount: matches.length,
			
			getValueAt: function(index) {
				return matches[index];
			},
			
			getStyleAt: function(index) {
				return 'default-match';
			},
			
			getCommentAt: function(index) {
				return null;
			},
			
			getImageAt: function(index) {
				return null;
			},
			
			removeValueAt: function(index) {
				throw new Error('not implemented');
			}
		};
		
		listener.onSearchResult(this, handler);
	},
	
	stopSearch: function() {
		// pass
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryWorkspacesAutocomplete]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryWorkspacesAutocomplete]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/