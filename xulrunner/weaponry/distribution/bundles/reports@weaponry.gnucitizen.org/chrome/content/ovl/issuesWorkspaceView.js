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
	
	let $exploitMenupopup = document.getElementById('weaponry-reports-issues-workspace-view-exploit-menupopup');
	
	if (dataRow.itemType != 'description') {
		$exploitMenupopup.parentNode.setAttribute('disabled', true);
		
		return;
	}
	
	let isExploitMenupopupDisabled = true;
	let $nodes = document.getElementById('weaponry-reports-issues-workspace-view-exploit-menupopup').childNodes;
	let nodesLength = $nodes.length;
	
	let i, $node;
	
	for (i = 0; i < nodesLength; i += 1) {
		$node = $nodes[i];
		
		if ($node.getAttribute('reportExploitType') == dataRow.issue) {
			$node.setAttribute('hidden', false);
			
			isExploitMenupopupDisabled = false;
		} else {
			$node.setAttribute('hidden', true);
		}
	}
	
	$exploitMenupopup.parentNode.setAttribute('disabled', isExploitMenupopupDisabled);
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
	
	if (fields.description) {
		fields.itemType = 'description';
	} else {
		fields.description = fields.explanation;
		fields.itemType = 'explanation';
	}
}

/* ------------------------------------------------------------------------ */

function handleWeaponryReportsLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $workspacetree = document.getElementById('weaponry-reports-issues-workspace-view-issues-workspacetree');
	
	$workspacetree.registerFieldsComputer(computateWeaponryReportsIssueFields);
	
	let $exploitMenupopup = document.getElementById('weaponry-reports-issues-workspace-view-exploit-menupopup');
	let components = weaponryCommon.enumerateComponents('weaponry-report-exploit-launchers');
	let componentsLength = components.length;
	
	let i, component, launcher, $menuitem;
	
	for (i = 0; i < componentsLength; i += 1) {
		component = components[i];
		launcher = null;
		
		if (component.type == 'service') {
			launcher = weaponryCommon.getService(component.contractID, 'IWeaponryReportExploitLauncher');
		} else {
			launcher = weaponryCommon.createInstance(component.contractID, 'IWeaponryReportExploitLauncher');
		}
		
		$menuitem = document.createElement('menuitem');
		
		$menuitem.setAttribute('class', 'weaponry-reports-issues-workspace-view-exploit-menupopup-menuitem');
		$menuitem.setAttribute('label', launcher.reportExploitName);
		$menuitem.setAttribute('reportExploitType', launcher.reportExploitType);
		$menuitem.setAttribute('reportExploitComponentType', component.type);
		$menuitem.setAttribute('reportExploitComponentContractID', component.contractID);
		$menuitem.setAttribute('hidden', true);
		
		$menuitem.addEventListener('click', function (event) {
			let $workspacetree = document.getElementById('weaponry-reports-issues-workspace-view-issues-workspacetree');
			let dataRow = $workspacetree.selectedDataRow;
			
			launcher.launchReportExploit(window.workspace, JSON.stringify(dataRow));
		}, false);
		
		$exploitMenupopup.appendChild($menuitem);
	}
}

window.addEventListener('load', handleWeaponryReportsLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/