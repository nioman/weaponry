/**
 *  fileMenu.js
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

installHandler('org.gnucitizen.weaponry.browser.fileMenu', {
	openNewWindow: function () {
		weaponryBrowser.openBrowserWindow();
	},
	
	openNewTab: function () {
		document.getElementById('browser-window-content-iframe').contentDocument.getElementById('browser-perspective-open-tab-command').doCommand();
	},
	
	printSetup: function () {
		let $command = document.getElementById('browser-window-content-iframe').contentDocument.getElementById('browser-perspective-tabs-richtabpanels').selectedPanel.$iframe.contentDocument.getElementById('browser-view-print-setup-command');
		
		$command.doCommand();
	},
	
	print: function () {
		let $command = document.getElementById('browser-window-content-iframe').contentDocument.getElementById('browser-perspective-tabs-richtabpanels').selectedPanel.$iframe.contentDocument.getElementById('browser-view-print-command');
		
		$command.doCommand();
	},
	
	onDOMContentLoaded: function (event) {
		if (event.target != document) {
			return;
		}
		
		if (document.getElementById('common-commandset')) {
			let self = org.gnucitizen.weaponry.browser.fileMenu;
			
			bindHandler('weaponry-browser-file-menupopup-new-window-command', 'command', self.openNewWindow);
			bindHandler('weaponry-browser-file-menupopup-new-tab-command', 'command', self.openNewTab);
			bindHandler('weaponry-browser-file-menupopup-print-setup-command', 'command', self.printSetup);
			bindHandler('weaponry-browser-file-menupopup-print-command', 'command', self.print);
		}
	}
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/