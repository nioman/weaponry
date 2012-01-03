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

Components.utils.import('resource://org.gnucitizen.weaponry.preferences/content/mod/weaponryPreferences.jsm');

/* ------------------------------------------------------------------------ */

function handleTestItemDblclickEvent(event) {
	let uri = event.currentTarget.getAttribute('uri');
	
	if (uri) {
		open(uri,  null, 'all,chrome,resizable,toolbar');
	} else {
		eval(event.currentTarget.getAttribute('dblclick'));
	}
}

/* ------------------------------------------------------------------------ */

function openConsoleWindow(event) {
	weaponryCommon.openErrorConsoleWindow();
}

function openAddonsWindow(event) {
	weaponryCommon.openAddOnsWindow();
}

function openPreferencesWindow(event) {
	weaponryPreferences.openPreferencesWindow();
}

/* ------------------------------------------------------------------------ */

function computeApplicationFields(fields) {
	if (!('image' in fields)) {
		fields.image = 'chrome://org.gnucitizen.acidplatform.basic/skin/xul/images/robot.png';
	}
}

/* ------------------------------------------------------------------------ */

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	document.getElementById('main-window-applications-dataroll').registerFieldsComputer(computeApplicationFields);
	document.getElementById('main-window-application-item-vbox').setAttribute('ondblclick', 'return handleTestItemDblclickEvent(event);');
	
	bindHandler('main-window-open-console-toolbarbutton', 'command', openConsoleWindow);
	bindHandler('main-window-open-addons-toolbarbutton', 'command', openAddonsWindow);
	bindHandler('main-window-open-preferences-toolbarbutton', 'command', openPreferencesWindow);
}

addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/