/**
 *  helpMenu.js
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

installHandler('org.gnucitizen.weaponry.support.helpMenu', {
	openHelp: function () {
		weaponryCommon.openUriExternally('http://code.google.com/p/weaponry/w/list');
	},
	
	openReportBugs: function () {
		weaponryCommon.openUriExternally('http://code.google.com/p/weaponry/issues/list');
	},
	
	openRequestFeatures: function () {
		weaponryCommon.openUriExternally('http://code.google.com/p/weaponry/issues/detail?id=2');
	},
	
	gotoWeaponry: function () {
		weaponryCommon.openUriExternally('http://weaponry.gnucitizen.org');
	},
	
	gotoGnucitizen: function () {
		weaponryCommon.openUriExternally('http://www.gnucitizen.com');
	},
	
	onDOMContentLoaded: function (event) {
		if (event.target != document) {
			return;
		}
		
		if (document.getElementById('help-menupopup')) {
			let self = org.gnucitizen.weaponry.support.helpMenu;
			
			bindHandler('weaponry-support-help-menu-help-menuitem', 'command', self.openHelp);
			bindHandler('weaponry-support-help-menu-report-bugs-menuitem', 'command', self.openReportBugs);
			bindHandler('weaponry-support-help-menu-request-features-menuitem', 'command', self.openRequestFeatures);
			bindHandler('weaponry-support-help-menu-go-to-weaponry-menuitem', 'command', self.gotoWeaponry);
			bindHandler('weaponry-support-help-menu-go-to-gnucitizen-menuitem', 'command', self.gotoGnucitizen);
		}
	}
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/