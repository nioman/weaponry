/**
 *  notesWorkspaceView.js
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

Components.utils.import('resource://notes.weaponry.gnucitizen.org/content/mod/weaponryNotes.jsm');

/* ------------------------------------------------------------------------ */

function handleAddNoteCommandEvent(event) {
	weaponryNotes.notesTable.recordTableItem(window.workspace, {text:'', metaData:'{}'});
	
	let $notesWorkspacelist = document.getElementById('weaponry-notes-workspace-view-notes-workspacelist');
	
	$notesWorkspacelist.refresh();
}

function handleOpenNotesDataListItemCommandEvent(event) {
	// pass
}

function handleCloseNotesDataListItemCommandEvent(event) {
	document.getElementById('weaponry-notes-workspace-view-notes-workspacelist').selectedIndex = -1;
}

function handleUpdateNotesDataListItemCommandEvent(event) {
	let $node = event.target;
	
	while (!$node.hasAttribute('noteROWID')) {
		$node = $node.parentNode;
	}
	
	let _ROWID_ = $node.getAttribute('noteROWID');
	let text = $node.getElementsByClassName('weaponry-notes-workspace-view-details-text-textbox')[0].value
	
	weaponryNotes.notesTable.updateTableItem(window.workspace, {_ROWID_:_ROWID_, text:text});
	
	document.getElementById('weaponry-notes-workspace-view-notes-workspacelist').refresh();
}

function handleDeleteNotesDataListItemCommandEvent(event) {
	let $node = event.target;
	
	while (!$node.hasAttribute('noteROWID')) {
		$node = $node.parentNode;
	}
	
	let _ROWID_ = $node.getAttribute('noteROWID');
	
	if (window.confirm(document.getElementById('weaponry-notes-workspace-view-properties-stringbundle').getString('delete-item-confirmation-message'))) {
		weaponryNotes.notesTable.deleteTableItem(window.workspace, {_ROWID_:_ROWID_});
		
		document.getElementById('weaponry-notes-workspace-view-notes-workspacelist').refresh();
	}
}

/* ------------------------------------------------------------------------ */

function computeNoteFields(fields) {
	let metaData = JSON.parse(fields.metaData);
	
	for (let field in metaData) {
		fields[field] = metaData[field];
	}
	
	fields.longText = fields.text.replace(/\n/g, ' ');
}

/* ------------------------------------------------------------------------ */

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $notesWorkspacelist = document.getElementById('weaponry-notes-workspace-view-notes-workspacelist');
	
	$notesWorkspacelist.registerFieldsComputer(computeNoteFields);
}

window.addEventListener('load', handleLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/