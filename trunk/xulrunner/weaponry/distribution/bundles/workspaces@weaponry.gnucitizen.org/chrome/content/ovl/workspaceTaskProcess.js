/**
 *  testTaskProcess.js
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

Components.utils.import('resource://workspaces.weaponry.gnucitizen.org/content/mod/weaponryWorkspaces.jsm');

/* ------------------------------------------------------------------------ */

window.workspace = weaponryWorkspaces.lookupWindowWorkspace(window);

/* ------------------------------------------------------------------------ */

window.taskPrototype.QueryInterface = XPCOMUtils.generateQI([Components.interfaces.IWeaponryTaskPrototype, Components.interfaces.IWeaponryWorkspaceHolder]);

window.taskPrototype.getWorkspace = function () {
	return window.workspace;
};

window.taskPrototype.setWorkspace = function (task) {
	// pass
};

window.taskPrototype.unsetWorkspace = function (task) {
	window.close();
};

/* ------------------------------------------------------------------------ */

function handleWeaponryWorkspacesLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.weaponryWorkspacesObserver = weaponryCommon.createObserver(['weaponry-workspace-destroyed'], function (subject, topic, data) {
		if (topic == 'weaponry-workspace-destroyed') {
			let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
			
			if (window.workspace.sameAs(workspace)) {
				window.close();
			}
		}
	});
	
	window.weaponryWorkspacesObserver.register();
}

window.addEventListener('load', handleWeaponryWorkspacesLoadEvent, false);

function handleWeaponryWorkspacesUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.weaponryWorkspacesObserver.unregister();
}

window.addEventListener('unload', handleWeaponryWorkspacesUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/