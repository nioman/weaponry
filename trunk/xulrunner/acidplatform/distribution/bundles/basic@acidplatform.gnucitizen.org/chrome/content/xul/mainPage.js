/**
 *  mainPage.js
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

Components.utils.import('resource://preferences.weaponry.gnucitizen.org/content/mod/weaponryPreferences.jsm');

/* ------------------------------------------------------------------------ */

function handleTestItemDblclickEvent(event) {
	let uri = event.currentTarget.getAttribute('uri');
	
	if (uri) {
		open(uri,  null, 'all,chrome,resizable');
	} else {
		eval(event.currentTarget.getAttribute('dblclick'));
	}
}

function handleOpenConsoleCommandEvent(event) {
	weaponryCommon.openErrorConsoleWindow();
}

function handleOpenAddonsCommandEvent(event) {
	weaponryCommon.openAddOnsWindow();
}

function handleOpenPreferencesCommandEvent(event) {
	weaponryPreferences.openPreferencesWindow();
}

/* ------------------------------------------------------------------------ */

function computeApplicationFields(fields) {
	if (!('image' in fields)) {
		fields.image = 'chrome://' + CHROMEBASE + '/skin/xul/images/robot.png';
	}
}

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $applicationsDataroll = document.getElementById('main-page-applications-dataroll');
	
	$applicationsDataroll.registerFieldsComputer(computeApplicationFields);
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/