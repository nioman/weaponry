/**
 *  preferencesPrefwindow.js
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

installHandler('org.gnucitizen.weaponry.preferences.preferencesPrefwindow', {
	openProxyDialog: function () {
		openDialog('chrome://' + CHROMEBASE + '/content/xul/proxyPrefwindow.xul', null, 'chrome,modal,centerscreen');
	},
	
	openSecurityCertificatesDialog: function () {
		openDialog('chrome://pippki/content/certManager.xul', null, 'chrome,modal,centerscreen');
	},
	
	openSecurityDevicesDialog: function () {
		openDialog('chrome://pippki/content/device_manager.xul', null, 'chrome,modal,centerscreen');
	},
	
	openRegistryDialog: function () {
		openDialog('chrome://' + CHROMEBASE + '/content/xul/registryDialog.xul', null, 'chrome,modal,centerscreen');
	},
	
	onDOMContentLoaded: function (event) {
		if (event.target != document) {
			return;
		}
		
		let self = org.gnucitizen.weaponry.preferences.preferencesPrefwindow;
		
		bindHandler('preferences-prefwindow-open-proxy-dialog-button', 'command', self.openProxyDialog);
		bindHandler('preferences-prefwindow-open-security-certificates-dialog-button', 'command', self.openSecurityCertificatesDialog);
		bindHandler('preferences-prefwindow-open-security-devices-dialog-button', 'command', self.openSecurityDevicesDialog);
		bindHandler('preferences-prefwindow-open-registry-dialog-button', 'command', self.openRegistryDialog);
	}
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/