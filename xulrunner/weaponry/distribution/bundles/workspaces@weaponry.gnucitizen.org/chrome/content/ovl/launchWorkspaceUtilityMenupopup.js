/**
 *  launchWorkspaceUtilityMenupopup.js
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

function handleWeaponryWorkspacesLaunchWorkspaceUtilityMenupopupDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $utilityMenupopup = document.getElementById('weaponry-workspaces-launch-workspace-utility-menupopup');
	let components = weaponryCommon.enumerateComponents('weaponry-workspace-utility-launchers');
	let componentsLength = components.length;
	
	let i, component, launcher, $menuitem;
	
	for (i = 0; i < componentsLength; i += 1) {
		component = components[i];
		
		if (component.type == 'service') {
			launcher = weaponryCommon.getService(component.contractID, 'IWeaponryWorkspaceUtilityLauncher');
		} else {
			launcher = weaponryCommon.createInstance(component.contractID, 'IWeaponryWorkspaceUtilityLauncher');
		}
		
		$menuitem = document.createElement('menuitem');
		
		$menuitem.setAttribute('class', 'weaponry-workspaces-launch-workspace-utility-menupopup-menuitem');
		$menuitem.setAttribute('label', launcher.utilityName);
		$menuitem.setAttribute('utilityComponentType', component.type);
		$menuitem.setAttribute('utilityComponentContractID', component.contractID);
		
		$menuitem.addEventListener('click', (function (launcher) {
			return function (event) {
				launcher.launchWorkspaceUtility(window.workspace);
			};
		})(launcher), false);
		
		$utilityMenupopup.appendChild($menuitem);
	}
}

window.addEventListener('DOMContentLoaded', handleWeaponryWorkspacesLaunchWorkspaceUtilityMenupopupDOMContentLoadedEvent, false);

function handleWeaponryWorkspacesLaunchWorkspaceUtilityMenupopupLoadEvent(event) {
	let $utilityMenupopup = document.getElementById('weaponry-workspaces-launch-workspace-utility-menupopup');
	
	if ($utilityMenupopup.childNodes.length == 0) {
		$utilityMenupopup.disabled = true;
	}
}

window.addEventListener('load', handleWeaponryWorkspacesLaunchWorkspaceUtilityMenupopupLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/