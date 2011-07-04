/**
 *  issuesWorkspaceView.js
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

function handleWeaponryReportsIssuesWorkspacetreeSelectEvent(event) {
	let $workspacetree = document.getElementById('weaponry-reports-issues-workspace-view-issues-workspacetree');
	let $templatebox = document.getElementById('weaponry-reports-issues-workspace-view-details-templatebox');
	let dataRow = $workspacetree.selectedDataRow;
	
	$templatebox.update(dataRow);
}

/* ------------------------------------------------------------------------ */

function computateWeaponryReportsIssueFields(fields) {
	if (fields.level == 0) {
		fields.levelName = 'informatinal';
	} else
	if (fields.level <= 3) {
		fields.levelName = 'low';
	} else
	if (fields.level <= 6) {
		fields.levelName = 'medium';
	} else
	if (fields.level <= 9) {
		fields.levelName = 'high';
	} else
	if (fields.level == 10) {
		fields.levelName = 'critical';
	} else {
		fields.levelName = 'undefined';
	}
	
	fields['_metaCellProperties__metaPath'] = fields.levelName + '-issue';
	
	if (fields.explanation) {
		fields.description = fields.explanation;
	}
}

/* ------------------------------------------------------------------------ */

function handleWeaponryReportsLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $workspacetree = document.getElementById('weaponry-reports-issues-workspace-view-issues-workspacetree');
	
	$workspacetree.registerFieldsComputer(computateWeaponryReportsIssueFields);
}

window.addEventListener('load', handleWeaponryReportsLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/