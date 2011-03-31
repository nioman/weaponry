/**
 *  workspaceWindow.js
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

window.workspace = weaponryWorkspaces.lookupWindowWorkspace(window);

/* ------------------------------------------------------------------------ */

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let lastPerspective = '';
	
	if (window.workspace) {
		lastPerspective = window.workspace.wrappedJSObject.getPropertyFast('org.gnucitizen.weaponry.workspaces.lastPerspective');
	}
	
	if (lastPerspective) {
		lastPerspective = lastPerspective.value;
	} else {
		lastPerspective = weaponryCommon.getPref('org.gnucitizen.weaponry.workspaces.lastPerspective');
		
		if (!lastPerspective) {
			lastPerspective = '_default';
		}
	}
	
	let workspacePerspectiveUri = '';
	
	if (lastPerspective == '_default') {
		workspacePerspectiveUri = 'chrome://' + CHROMEBASE + '/content/xul/workspacePerspective.xul';
	} else {
		workspacePerspectiveUri = 'chrome://' + CHROMEBASE + '/content/xul/workspacePerspective.xul?perspective=' + lastPerspective;
	}
	
	let $contentIframe = document.getElementById('workspace-window-content-iframe');
	
	if ($contentIframe.getAttribute('src') != workspacePerspectiveUri) {
		$contentIframe.setAttribute('src', workspacePerspectiveUri);
	}
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	if (!window.workspace) {
		Components.utils.reportError('no workspace specified');
		
		window.close();
	}
	
	let $properties = document.getElementById('workspace-window-properties-stringbundle');
	
	document.originalTitle = document.title;
	document.title = $properties.getFormattedString('workspace-window-title', [window.workspace.name]);
	
	window.workspacesObserver = weaponryCommon.createObserver(['weaponry-workspace-renamed', 'weaponry-workspace-destroyed'], function (subject, topic, data) {
		if (topic == 'weaponry-workspace-renamed') {
			let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
			
			if (window.workspace.sameAs(workspace)) {
				document.title = $properties.getFormattedString('workspace-window-title', [window.workspace.name]);
			}
		} else
		if (topic == 'weaponry-workspace-destroyed') {
			let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
			
			if (window.workspace.sameAs(workspace)) {
				window.close();
			}
		}
	});
	
	window.workspacesObserver.register();
	
	weaponryCommon.observerService.notifyObservers(window.workspace, 'weaponry-workspace-window-opened', null);
}

window.addEventListener('load', handleLoadEvent, false);

function handleUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $contentIframe = document.getElementById('workspace-window-content-iframe');
	
	let currentPerspective = weaponryWorkspaces.lookupWorkspaceWindowPerspective($contentIframe.contentWindow);
	
	window.workspace.wrappedJSObject.setPropertyFast('org.gnucitizen.weaponry.workspaces.lastPerspective', currentPerspective);
	
	weaponryCommon.setPref('org.gnucitizen.weaponry.workspaces.lastPerspective', currentPerspective);
	
	window.workspacesObserver.unregister();
	
	weaponryCommon.observerService.notifyObservers(window.workspace, 'weaponry-workspace-window-closed', null);
}

window.addEventListener('unload', handleUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/