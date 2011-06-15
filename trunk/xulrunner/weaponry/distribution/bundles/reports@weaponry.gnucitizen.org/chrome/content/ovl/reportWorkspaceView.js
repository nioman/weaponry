/**
 *  reportWorkspaceView.js
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

function computeWeaponryReportsReportIssuesFields(fields) {
	if (!window.weaponryReportsReportIssuesGroups[fields.title]) {
		window.weaponryReportsReportIssuesGroups[fields.title] = true;
		
		fields.hideIssueGenerals = false;
	} else {
		fields.hideIssueGenerals = true;
	}
}

/* ------------------------------------------------------------------------ */

function handleReportWorkspacerollRefreshEvent(event) {
	window.weaponryReportsReportIssuesGroups = {};
}

/* ------------------------------------------------------------------------ */

function handleWeaponryReportsLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $properties = document.getElementById('weaponry-reports-report-workspace-view-properties-stringbundle');
	
	document.originalTitle = document.title;
	document.title = $properties.getFormattedString('report-page-title', [window.workspace.name]);
	
	let $workspaceroll = document.getElementById('weaponry-reports-report-workspace-view-report-workspaceroll');
	
	$workspaceroll.registerFieldsComputer(computeWeaponryReportsReportIssuesFields);
	
	window.weaponryReportsReportIssuesGroups = {};
	
	$workspaceroll.addEventListener('refresh', handleReportWorkspacerollRefreshEvent, false);
}

window.addEventListener('load', handleWeaponryReportsLoadEvent, false);

function handleWeaponryReportsUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $workspaceroll = document.getElementById('weaponry-reports-report-workspace-view-report-workspaceroll');
	
	$workspaceroll.removeEventListener('refresh', handleReportWorkspacerollRefreshEvent, false);
}

window.addEventListener('unload', handleWeaponryReportsUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/