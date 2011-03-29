/**
 *  switchWorkspacePerspectiveMenupopup.js
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

function handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupMenuitemCommandEvent(event) {
	let workspacePerspective = event.target.getAttribute('workspaceperspective');
	
	if (workspacePerspective != window.currentPerspective) {
		switchWorkspacePerspective(event.target.getAttribute('workspaceperspective'));
	}
}

/* ------------------------------------------------------------------------ */

function handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	try {
		window.currentPerspective = document.location.search.match(/perspective=([^&]+)/)[1];
	} catch (e) {
		window.currentPerspective = '_default';
	}
	
	let $nodes = document.querySelectorAll('menupopup#weaponry-workspaces-switch-workspace-perspective-menupopup > menuitem[workspaceperspective][name="workspaceperspective"][type="radio"]');
	let nodesLength = $nodes.length;
	
	let i;
	
	for (i = 0; i < nodesLength; i += 1) {
		$nodes[i].addEventListener('command', handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupMenuitemCommandEvent, false);
	}
	
	let $perspectiveMenuitem = document.querySelector('menupopup#weaponry-workspaces-switch-workspace-perspective-menupopup > menuitem[workspaceperspective="' + window.currentPerspective + '"][name="workspaceperspective"][type="radio"]');
	
	if ($perspectiveMenuitem) {
		$perspectiveMenuitem.setAttribute('checked', 'true');
	}
}

window.addEventListener('DOMContentLoaded', handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupDOMContentLoadedEvent, false);

function handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupLoadEvent(event) {
	let $perspectiveMenupopup = document.getElementById('weaponry-workspaces-switch-workspace-perspective-menupopup');
	
	if ($perspectiveMenupopup.childNodes.length == 0) {
		$perspectiveMenupopup.disabled = true;
	}
}

window.addEventListener('load', handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupLoadEvent, false);

function handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupUnloadEvent(event) {
	let $nodes = document.querySelectorAll('menupopup#weaponry-workspaces-switch-workspace-perspective-menupopup > menuitem[workspaceperspective][name="workspaceperspective"][type="radio"]');
	let nodesLength = $nodes.length;
	
	let i;
	
	for (i = 0; i < nodesLength; i += 1) {
		$nodes[i].removeEventListener('command', handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupMenuitemCommandEvent, false);
	}
}

window.addEventListener('unload', handleWeaponryWorkspacesSwitchWorkspacePerspectiveMenupopupUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/