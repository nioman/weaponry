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

installHandler('org.gnucitizen.weaponry.common.toolsMenu', {
	openAddOns: function () {
		weaponryCommon.openAddOnsWindow();
	},
	
	openErrorConsole: function () {
		weaponryCommon.openErrorConsoleWindow();
	},
	
	onDOMContentLoaded: function (event) {
		if (event.target != document) {
			return;
		}
		
		if (document.getElementById('tools-menupopup')) {
			let self = org.gnucitizen.weaponry.common.toolsMenu;
			
			bindHandler('tools-menu-open-add-ons-command', 'command', self.openAddOns);
			bindHandler('tools-menu-open-error-console-command', 'command', self.openErrorConsole);
		}
	}
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/