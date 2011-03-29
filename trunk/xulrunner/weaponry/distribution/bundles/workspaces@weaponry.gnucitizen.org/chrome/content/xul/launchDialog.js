/**
 *  launchDialog.js
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

function generateWorkspaceName() {
	return weaponryWorkspaces.generateRandomWorkspaceName();
}

/* ------------------------------------------------------------------------ */

window.lastRecordedWorkspaceName = '';

/* ------------------------------------------------------------------------ */

function handleCustomizeWorkspaceNameClickEvent(event) {
	if (!event.target.disabled) {
		let $workspaceTextbox = document.getElementById('launch-dialog-workspace-textbox');
		
		if (event.target.checked) {
			$workspaceTextbox.disabled = true;
			$workspaceTextbox.value = generateWorkspaceName();
		} else {
			$workspaceTextbox.disabled = false;
			
			if (!window.lastRecordedWorkspaceName) {
				window.lastRecordedWorkspaceName = generateWorkspaceName();
			}
			
			$workspaceTextbox.value = window.lastRecordedWorkspaceName;
		}
	}
}

function handleWorkspaceInputEvent(event) {
	if (!event.target.disabled) {
		let $customizeWorkspaceNameCheckbox = document.getElementById('launch-dialog-customize-workspace-name-checkbox');
		
		if ($customizeWorkspaceNameCheckbox.checked) {
			window.lastRecordedWorkspaceName = event.target.value;
		}
	}
}

/* ------------------------------------------------------------------------ */

function dispatchUiEvent(eventName, data) {
	let event = document.createEvent('Event');
	
	event.initEvent(eventName, true, true);
	
	event.data = data;
	
	return window.dispatchEvent(event);
}

/* ------------------------------------------------------------------------ */

function handleDialogAcceptEvent(event) {
	if (!dispatchUiEvent('dialogacceptstaging')) {
		event.stopPropagation();
		event.preventDefault();
		
		return false;
	}
	
	let $workspaceTextbox = document.getElementById('launch-dialog-workspace-textbox');
	let workspaceName = $workspaceTextbox.value.trim();
	
	if (!workspaceName) {
		let $properties = document.getElementById('launch-dialog-properties-stringbundle');
		
		window.alert($properties.getString('no-workspace-name-failure-message'));
		
		event.stopPropagation();
		event.preventDefault();
		
		return false;
	}
	
	let workspace = weaponryWorkspaces.ensureWorkspace(workspaceName);
	
	if (!workspace) {
		let $properties = document.getElementById('launch-dialog-properties-stringbundle');
		
		window.alert($properties.getString('cannot-create-workspace-failure-message'));
		
		event.stopPropagation();
		event.preventDefault();
		
		return false;
	}
	
	window.workspace = workspace;
	
	if (!dispatchUiEvent('dialogacceptfinish')) {
		window.workspace.delete();
		
		delete window.workspace;
		
		event.stopPropagation();
		event.preventDefault();
		
		return false;
	}
}

window.addEventListener('dialogaccept', handleDialogAcceptEvent, true);

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $workspaceTextbox = document.getElementById('launch-dialog-workspace-textbox');
	
	$workspaceTextbox.disabled = true;
	
	if (window.workspace) {
		$workspaceTextbox.value = window.workspace.name;
		
		let $customizeWorkspaceNameCheckbox = document.getElementById('launch-dialog-customize-workspace-name-checkbox');
		
		$customizeWorkspaceNameCheckbox.disabled = true;
		$customizeWorkspaceNameCheckbox.checked = true;
	}
	
	window.sizeToContent();
}

window.addEventListener('load', handleLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/