/**
 *  certManager.js
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

(function () {
	window.weaponrySecurityLoadCertsFunctionSource = LoadCerts.toString();
	
	window.LoadCerts = function () {
		let preferencesService = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		let isEnabled = false;
		
		try {
			isEnabled = preferencesService.getBoolPref('org.gnucitizen.weaponry.security.CertOverrideService.enabled');
		} catch (e) {
			// pass
		}
		
		if (isEnabled) {
			let patchedSource = window.weaponrySecurityLoadCertsFunctionSource.replace(/^function LoadCerts\(\) \{|\}$/g, '')
			                                                                  .replace('serverTreeView = Components.classes[nsCertTree].createInstance(nsICertTree);', '')
			                                                                  .replace('serverTreeView.loadCertsFromCache(certcache, nsIX509Cert.SERVER_CERT);', '');
			
			eval(patchedSource);
		} else {
			let originalSource = window.weaponrySecurityLoadCertsFunctionSource;
			
			eval(originalSource);
		}
	};
})();

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/