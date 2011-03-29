/**
 *  workspaceAngle.js
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

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	if (!window.workspace) {
		Components.utils.reportError('no workspace specified');
		
		window.location = 'about:blank';
	}
	
	let viewMatch = window.document.location.search.match(/view=([^&]+)/);
	let view = '';
	
	if (viewMatch) {
		view = decodeURIComponent(viewMatch[1]);
	}
	
	let $viewIframe = document.getElementById('workspace-angle-view-iframe');
	
	if (view) {
		$viewIframe.setAttribute('src', 'chrome://' + CHROMEBASE + '/content/xul/workspaceView.xul?view=' + encodeURIComponent(view));
	} else {
		$viewIframe.setAttribute('src', 'chrome://' + CHROMEBASE + '/content/xul/workspaceView.xul');
	}
}

window.addEventListener('load', handleLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/