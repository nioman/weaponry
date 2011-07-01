/**
 *  WeaponryWorkspacesManager.js
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

function WeaponryWorkspacesManager() {
	this.workspacesById = {};
	this.workspacesByName = {};
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
}

WeaponryWorkspacesManager.prototype = {
	classDescription: 'Weaponry Workspaces Manager',
	classID: Components.ID('{0561d9e0-045e-11df-8a39-0800200c9a66}'),
	contractID: '@workspaces.weaponry.gnucitizen.org/manager;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryWorkspacesManager, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function (subject, topic, data) {
		if (topic == 'profile-after-change') {
			this.initializeComponent(subject, topic, data);
		} else
		if (topic == 'profile-before-change') {
			this.deinitializeComponent(subject, topic, data);
		} else
		
		if (topic == 'weaponry-workspace-created') {
			this.handleWorkspaceCreateEvent(subject.QueryInterface(CI.IWeaponryWorkspace));
		} else
		if (topic == 'weaponry-workspace-destroyed') {
			this.handleWorkspaceDestroyEvent(subject.QueryInterface(CI.IWeaponryWorkspace));
		} else
		if (topic == 'weaponry-workspace-renamed') {
			this.handleWorkspaceRenameEvent(subject.QueryInterface(CI.IWeaponryWorkspace));
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		this.observerService.addObserver(this, 'weaponry-workspace-created', false);
		this.observerService.addObserver(this, 'weaponry-workspace-destroyed', false);
		this.observerService.addObserver(this, 'weaponry-workspace-renamed', false);
	},
	
	deinitializeComponent: function (subject, topic, data) {
		this.observerService.removeObserver(this, 'weaponry-workspace-created');
		this.observerService.removeObserver(this, 'weaponry-workspace-destroyed');
		this.observerService.removeObserver(this, 'weaponry-workspace-renamed');
	},
	
	/* -------------------------------------------------------------------- */
	
	handleWorkspaceCreateEvent: function (workspace) {
		this.registerWorkspace(workspace);
	},
	
	handleWorkspaceDestroyEvent: function (workspace) {
		this.unregisterWorkspace(workspace);
	},
	
	handleWorkspaceRenameEvent: function (workspace) {
		this.registerWorkspace(workspace);
	},
	
	/* -------------------------------------------------------------------- */
	
	registerWorkspace: function (workspace) {
		this.unregisterWorkspace(workspace);
		
		this.workspacesById[workspace.id] = workspace;
		
		this.workspacesByName[workspace.name] = workspace;
	},
	
	unregisterWorkspace: function (workspace) {
		for (let name in this.workspacesByName) {
			if (workspace.sameAs(this.workspacesByName[name])) {
				delete this.workspacesByName[name];
				delete this.workspacesById[workspace.id];
				
				break;
			}
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	enumerateRegisteredWorkspaces: function () {
		let workspaces = CC['@mozilla.org/array;1'].createInstance(CI.nsIMutableArray);
		
		for (let name in this.workspacesByName) {
			workspaces.appendElement(this.workspacesByName[name].QueryInterface(CI.nsISupports), false);
		}
		
		return workspaces.enumerate();
	},
	
	enumerateRegisteredWorkspacesAsynchronously: function (handler, completionHandler) {
		let enumerator = this.enumerateRegisteredWorkspaces();
		
		while (enumerator.hasMoreElements()) {
			handler.handle(enumerator.getNext());
		}
		
		if (completionHandler) {
			completionHandler.handle();
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	getRegisteredWorkspaceById: function (id) {
		return this.workspacesById[id] ? this.workspacesById[id] : null;
	},
	
	getRegisteredWorkspaceByName: function (name) {
		return this.workspacesByName[name] ? this.workspacesByName[name] : null;
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryWorkspacesManager]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/