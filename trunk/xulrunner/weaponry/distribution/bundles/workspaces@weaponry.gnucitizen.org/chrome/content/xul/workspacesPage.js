/**
 *  workspacesPage.js
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

function handleOpenWorkspaceCommandEvent(event) {
	weaponryWorkspaces.startOpenWorkspaceUI(window, document.getElementById('workspaces-page-workspaces-datalist').selectedDataRow.name);
};

function handleRenameWorkspaceCommandEvent(event) {
	weaponryWorkspaces.startRenameWorkspaceUI(window, document.getElementById('workspaces-page-workspaces-datalist').selectedDataRow.name);
}

function handleDeleteWorkspaceCommandEvent(event) {
	weaponryWorkspaces.startDeleteWorkspaceUI(window, document.getElementById('workspaces-page-workspaces-datalist').selectedDataRow.name);
}

/* ------------------------------------------------------------------------ */

function selectContentDeckPane() {
	if (document.getElementById('workspaces-page-workspaces-datalist').obtainDataLen() == 0) {
		document.getElementById('workspaces-page-content-deck').selectedPanel = document.getElementById('workspaces-page-splash-vbox');
	} else {
		document.getElementById('workspaces-page-content-deck').selectedPanel = document.getElementById('workspaces-page-workspaces-vbox');
	}
}

/* ------------------------------------------------------------------------ */

function selectWorkspacesDatalistItem() {
	let $workspacesDatalist = document.getElementById('workspaces-page-workspaces-datalist');
	
	if ($workspacesDatalist.selectedIndex < 0) {
		$workspacesDatalist.selectedIndex = 0;
	}
}

/* ------------------------------------------------------------------------ */

function dispatchUiEvent(eventName, workspace) {
	let event = document.createEvent('Event');
	
	event.initEvent(eventName, true, true);
	
	event.data = {workspace:workspace};
	
	return window.dispatchEvent(event);
}

/* ------------------------------------------------------------------------ */

function computateWorkspacesFields(fields) {
	fields.thumbnailUri = fields.thumbnailUri ? fields.thumbnailUri : 'chrome://' + CHROMEBASE + '/skin/xul/images/workspace.png';
}

/* ------------------------------------------------------------------------ */

function doInsertWorkspace(workspace, data) {
	let $workspacesDatalist = document.getElementById('workspaces-page-workspaces-datalist');
	
	$workspacesDatalist.appendDataRow({id:workspace.id, name:workspace.name, thumbnailUri:workspace.thumbnailUri});
}

function doCreateWorkspace(workspace, data) {
	let $workspacesDatalist = document.getElementById('workspaces-page-workspaces-datalist');
	
	$workspacesDatalist.appendDataRow({id:workspace.id, name:workspace.name, thumbnailUri:workspace.thumbnailUri});
}

function doInitializeWorkspace(workspace, data) {
	// pass
}

function doRenameWorkspace(workspace, data) {
	let $workspacesDatalist = document.getElementById('workspaces-page-workspaces-datalist');
	
	$workspacesDatalist.updateDataRow({id:workspace.id, name:workspace.name, thumbnailUri:workspace.thumbnailUri}, $workspacesDatalist.obtainDataPos({name:data}));
}

function doDestroyWorkspace(workspace, data) {
	let $workspacesDatalist = document.getElementById('workspaces-page-workspaces-datalist');
	
	$workspacesDatalist.removeDataRow($workspacesDatalist.obtainDataPos({id:workspace.id}));
}

/* ------------------------------------------------------------------------ */

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $workspacesDatalist = document.getElementById('workspaces-page-workspaces-datalist');
	
	$workspacesDatalist.registerFieldsComputer(computateWorkspacesFields);
	
	weaponryWorkspaces.enumerateWorkspaces(
		function (workspace) {
			if (dispatchUiEvent('workspaceToBeInserted', workspace)) {
				doInsertWorkspace(workspace, null);
			}
		},
		
		function () {
			selectWorkspacesDatalistItem();
			selectContentDeckPane();
		}
	);
	
	window.workspacesObserver = weaponryCommon.createObserver(['weaponry-workspace-created', 'weaponry-workspace-initialized', 'weaponry-workspace-renamed', 'weaponry-workspace-destroyed'], function (subject, topic, data) {
		let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
		
		if (topic == 'weaponry-workspace-created') {
			if (dispatchUiEvent('workspaceToBeCreated', workspace)) {
				doCreateWorkspace(workspace, data);
			}
			
			selectWorkspacesDatalistItem();
			selectContentDeckPane();
		} else
		if (topic == 'weaponry-workspace-initialized') {
			if (dispatchUiEvent('workspaceToBeInitialized', workspace)) {
				doInitializeWorkspace(workspace, data);
			}
			
			selectWorkspacesDatalistItem();
			selectContentDeckPane();
		} else
		if (topic == 'weaponry-workspace-renamed') {
			if (dispatchUiEvent('workspaceToBeRenamed', workspace)) {
				doRenameWorkspace(workspace, data);
			}
			
			selectWorkspacesDatalistItem();
			selectContentDeckPane();
		} else
		if (topic == 'weaponry-workspace-destroyed') {
			if (dispatchUiEvent('workspaceToBeDestroyed', workspace)) {
				doDestroyWorkspace(workspace, data);
			}
			
			selectWorkspacesDatalistItem();
			selectContentDeckPane();
		}
	});
	
	window.workspacesObserver.register();
}

window.addEventListener('load', handleLoadEvent, false);

function handleUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.workspacesObserver.unregister();
}

window.addEventListener('unload', handleUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/