/**
 *  toolsMenu.js
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

function handleMemoryCommandEvent(event) {
	weaponryCommon.openWindow(null, 'about:memory?verbose', '', 'all,chrome,resizable,centerscreen,width=800,height=600');
}

function handleColorsCommandEvent(event) {
	weaponryCommon.openWindow(null, 'chrome://development.weaponry.gnucitizen.org/content/htm/colors.htm', '', 'all,chrome,resizable,centerscreen,width=400,height=600');
}

function handleRequestsCommandEvent(event) {
	weaponryCommon.openWindow(null, 'chrome://development.weaponry.gnucitizen.org/content/htm/requests.htm', '', 'all,chrome,resizable,centerscreen,width=600,height=400');
}

function handleInspectorCommandEvent(event) {
	weaponryCommon.openWindow(null, 'chrome://inspector/content/inspector.xul', '', 'all,chrome,resizable,centerscreen');
}

function handleJsshellCommandEvent(event) {
	weaponryCommon.openWindow(null, 'chrome://jsshell/content/jsshell.xul', '', 'all,chrome,resizable,centerscreen,width=500,height=400,scrollbars=yes');
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/