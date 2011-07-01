/**
 *  WeaponryNotesService.js
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

const CHROMEBASE = 'notes.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryNotesService() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
	Components.utils.import('resource://workspaces.weaponry.gnucitizen.org/content/mod/weaponryWorkspaces.jsm');
	
	this.notesTable = weaponryWorkspaces.workspacesService.getTableAPI('weaponryNotes', 'weaponry-notes');
}

WeaponryNotesService.prototype = {
	classDescription: 'Weaponry Notes Service',
	classID: Components.ID('{70f516b0-9c19-11df-981c-0800200c9a66}'),
	contractID: '@notes.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryNotesService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function(subject, topic, data) {
		if (topic == 'profile-after-change') {
			this.initializeComponent(subject, topic, data);
		} else
		if (topic == 'profile-before-change') {
			this.deinitializeComponent(subject, topic, data);
		} else
		
		if (topic == 'weaponry-workspace-connection-prepared') {
			this.prepareWorkspaceConnection(subject, topic, data);
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		weaponryCommon.observerService.addObserver(this, 'weaponry-workspace-connection-prepared', false);
	},
	
	deinitializeComponent: function (subject, topic, data) {
		weaponryCommon.observerService.removeObserver(this, 'weaponry-workspace-connection-prepared');
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareWorkspaceConnection: function (subject, topic, data) {
		let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
		
		workspace.executeStatement('CREATE TABLE IF NOT EXISTS weaponryNotes (timestamp DATE DEFAULT CURRENT_TIMESTAMP, text TEXT, metaData TEXT DEFAULT "{}" NOT NULL)', null);
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryNotesService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/