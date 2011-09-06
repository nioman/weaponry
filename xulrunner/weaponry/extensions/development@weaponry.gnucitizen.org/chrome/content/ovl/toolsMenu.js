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

installHandler('org.gnucitizen.weaponry.development.toolsMenu', {
	reloadUi: function () {
		weaponryCommon.reloadAllWindows();
	},
	
	openMemoryWindow: function () {
		weaponryCommon.openWindow(null, 'chrome://org.gnucitizen.weaponry.development/content/htm/memory.htm', '', 'all,chrome,resizable,centerscreen,width=400,height=600');
	},
	
	openColorsWindow: function () {
		weaponryCommon.openWindow(null, 'chrome://org.gnucitizen.weaponry.development/content/htm/colors.htm', '', 'all,chrome,resizable,centerscreen,width=400,height=600');
	},
	
	openRequestsWindow: function () {
		weaponryCommon.openWindow(null, 'chrome://org.gnucitizen.weaponry.development/content/htm/requests.htm', '', 'all,chrome,resizable,centerscreen,width=600,height=400');
	},
	
	openInspectorWindow: function () {
		weaponryCommon.openWindow(null, 'chrome://inspector/content/inspector.xul', '', 'all,chrome,resizable,centerscreen');
	},
	
	openJsshellWindow: function () {
		weaponryCommon.openWindow(null, 'chrome://jsshell/content/jsshell.xul', '', 'all,chrome,resizable,centerscreen,width=500,height=400,scrollbars=yes');
	},
	
	onDOMContentLoaded: function (event) {
		if (event.target != document) {
			return;
		}
		
		if (document.getElementById('tools-menupopup')) {
			let self = org.gnucitizen.weaponry.development.toolsMenu;
			
			bindHandler('weaponry-development-tools-menu-reload-ui-command', 'command', self.reloadUi);
			bindHandler('weaponry-development-tools-menu-memory-menuitem', 'command', self.openMemoryWindow);
			bindHandler('weaponry-development-tools-menu-colors-menuitem', 'command', self.openColorsWindow);
			bindHandler('weaponry-development-tools-menu-requests-menuitem', 'command', self.openRequestsWindow);
			bindHandler('weaponry-development-tools-menu-inspector-menuitem', 'command', self.openInspectorWindow);
			bindHandler('weaponry-development-tools-menu-jsshell-menuitem', 'command', self.openJsshellWindow);
		}
	}
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/