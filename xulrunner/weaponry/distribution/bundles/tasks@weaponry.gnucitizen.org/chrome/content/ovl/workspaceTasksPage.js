/**
 *  workspaceTasksPage.js
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

function handleTaskToBeEvent(event) {
	if (event.data.task instanceof CI.IWeaponryWorkspaceHolder) {
		let workspaceHolder = event.data.task.QueryInterface(CI.IWeaponryWorkspaceHolder);
		
		if (!window.workspace.sameAs(workspaceHolder.getWorkspace())) {
			event.preventDefault();
		}
	} else
	if (event.data.task.taskPrototype instanceof CI.IWeaponryWorkspaceHolder) {
		let workspaceHolder = event.data.task.taskPrototype.QueryInterface(CI.IWeaponryWorkspaceHolder);
		
		if (!window.workspace.sameAs(workspaceHolder.getWorkspace())) {
			event.preventDefault();
		}
	} else {
		event.preventDefault();
	}
}

window.addEventListener('taskToBeInserted', handleTaskToBeEvent, false);

window.addEventListener('taskToBeCreated', handleTaskToBeEvent, false);

window.addEventListener('taskToBeInitialized', handleTaskToBeEvent, false);

window.addEventListener('taskToBeUpdated', handleTaskToBeEvent, false);

window.addEventListener('taskToBeDestroyed', handleTaskToBeEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/