/**
 *  mainWindow.js
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

function handleEntryDblclickEvent(event) {
	let uri = event.currentTarget.getAttribute('uri');
	let directory = weaponryCommon.ioService.newURI(uri, null, null).QueryInterface(CI.nsIFileURL).file;
	
	directory.append('mainWindow.xul');
	
	alert('chrome-uri:' + weaponryCommon.ioService.newFileURI(directory).spec);
}

function handleAddProjectCommandEvent(event) {
	let $properties = document.getElementById('main-window-properties-stringbundle');
	let filePicker = CC['@mozilla.org/filepicker;1'].createInstance(CI.nsIFilePicker);
	
	filePicker.init(window, $properties.getString('select-directroy-filepicker-title'), CI.nsIFilePicker.modeGetFolder);
	
	if (filePicker.show() == CI.nsIFilePicker.returnOK) {
		let directory = filePicker.file;
		let uri = weaponryCommon.ioService.newFileURI(directory).spec;
		let label = directory.leafName;
		let applications = JSON.parse(weaponryCommon.getPref('org.gnucitizen.acidplatform.basic.applications'));
		
		applications.push(weaponryCommon.ioService.newFileURI(directory).spec);
		
		weaponryCommon.setPref('org.gnucitizen.acidplatform.basic.applications', JSON.stringify(applications));
		
		directory.append('icon.png');
		
		let icon = weaponryCommon.ioService.newFileURI(directory).spec;
		let $applicationsDatalist = document.getElementById('main-window-applications-datalist');
		
		$applicationsDatalist.appendDataRow({uri:uri, icon:icon, label:label});
	}
}

/* ------------------------------------------------------------------------ */

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $applicationsDatalist = document.getElementById('main-window-applications-datalist');
	let applications = JSON.parse(weaponryCommon.getPref('org.gnucitizen.acidplatform.basic.applications'));
	let applicationsLength = applications.length;
	
	let i;
	let uri;
	let directory;
	let icon;
	let label;
	
	for (i = 0; i < applicationsLength; i += 1) {
		uri = applications[i];
		directory = weaponryCommon.ioService.newURI(uri, null, null).QueryInterface(CI.nsIFileURL).file;
		label = directory.leafName;
		
		directory.append('icon.png');
		
		icon = weaponryCommon.ioService.newFileURI(directory).spec;
		
		$applicationsDatalist.appendDataRow({uri:uri, icon:icon, label:label});
	}
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/