/**
 *  macMenu.js
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

function handleMacMenuDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $aboutMenuitem = document.getElementById('help-menupopup-about-menuitem');
	let $aboutCommand = document.getElementById('help-menu-about-command');
	
	try {
		$aboutMenuitem.id = 'aboutName';
		
		$aboutMenuitem.setAttribute('command', '');
		$aboutMenuitem.setAttribute('label', $aboutCommand.getAttribute('label'));
		$aboutMenuitem.setAttribute('oncommand', $aboutCommand.getAttribute('oncommand'));
	} catch (e) {
		// pass
	}
	
	let $quitMenuitem = document.getElementById('file-menupopup-quit-menuitem');
	let $quitCommand = document.getElementById('file-menu-quit-command');
	
	try {
		$quitMenuitem.id = 'menu_FileQuitItem';
		
		$quitMenuitem.setAttribute('command', '');
		$quitMenuitem.setAttribute('label', $quitCommand.getAttribute('label'));
		$quitMenuitem.setAttribute('oncommand', $quitCommand.getAttribute('oncommand'));
	} catch (e) {
		// pass
	}
}

window.addEventListener('DOMContentLoaded', handleMacMenuDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/