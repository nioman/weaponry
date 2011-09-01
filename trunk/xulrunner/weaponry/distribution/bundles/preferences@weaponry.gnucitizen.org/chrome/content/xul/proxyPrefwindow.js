/**
 *  proxyPrefwindow.js
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

function reloadPAC() {
	weaponryCommon.getService('@mozilla.org/network/protocol-proxy-service;1').reloadPAC();
}

/* ------------------------------------------------------------------------ */

function updateReloadButtonUi() {
	let typedUrl = document.getElementById('network-proxy-autoconfig-url').value;
	let proxyTypeCur = document.getElementById('network.proxy.type').value;
	let pacUrl = weaponryCommon.getPref('network.proxy.autoconfig_url');
	let proxyType = weaponryCommon.getPref('network.proxy.type');
	let $prefAdvancedProxiesDisableButtonReload = document.getElementById('pref.advanced.proxies.disable_button.reload');
	
	$prefAdvancedProxiesDisableButtonReload.disabled = (proxyTypeCur != 2 || proxyType != 2 || typedUrl != pacUrl);
}

/* ------------------------------------------------------------------------ */

function readHttpProxyServer() {
	if (window.$networkProxyShareProxySettings.value) {
		updateProtocolUi();
	}
}

function readHttpProxyPort() {
	if (window.$networkProxyShareProxySettings.value) {
		updateProtocolUi();
	}
}

function readProxyProtocol(protocol, isPort) {
	if (window.$networkProxyShareProxySettings.value) {
		let $pref = document.getElementById('network.proxy.http' + (isPort ? '_port' : ''));  
		
		return $pref.value;
   }
	
	let $backupPref = document.getElementById('network.proxy.backup.' + protocol + (isPort ? '_port' : ''));
	
	return $backupPref.hasUserValue ? $backupPref.value : undefined;
}

/* ------------------------------------------------------------------------ */

function updateProtocolUi() {
	let types = ['ssl', 'ftp', 'socks', 'gopher'];
	let typesLength = types.length;
	
	for (let i = 0; i < typesLength; i += 1) {
		let type = types[i];
		let $proxyServerPref = document.getElementById('network.proxy.' + type);
		let $proxyPortPref = document.getElementById('network.proxy.' + type + '_port');
		
		if (!window.$networkProxyShareProxySettings.value) {
			let $backupServerPref = document.getElementById('network.proxy.backup.' + type);
			let $backupPortPref = document.getElementById('network.proxy.backup.' + type + '_port');
			
			if ($backupServerPref.hasUserValue) {
				$proxyServerPref.value = $backupServerPref.value;
				
				$backupServerPref.reset();
			}
			
			if ($backupPortPref.hasUserValue) {
				$proxyPortPref.value = $backupPortPref.value;
				
				$backupPortPref.reset();
			}
		}
		
		$proxyServerPref.updateElements();
		$proxyPortPref.updateElements();
		
		$proxyServerPref.disabled = window.$networkProxyType.value != 1 || window.$networkProxyShareProxySettings.value;
		$proxyPortPref.disabled = $proxyServerPref.disabled;
	}
	
	window.$networkProxySocksVersion.disabled = window.$networkProxyType.value != 1 || window.$networkProxyShareProxySettings.value;
}

function updateUI() {
	window.$networkProxyHttp.disabled = window.$networkProxyType.value != 1;
	window.$networkProxyHttpPort.disabled = window.$networkProxyType.value != 1;
	
	updateProtocolUi();
	
	window.$networkProxyShareProxySettings.disabled = window.$networkProxyType.value != 1;
	window.$networkProxyNoProxiesOn.disabled = window.$networkProxyType.value != 1;
	window.$networkProxyAutoconfigUrl.disabled = window.$networkProxyType.value != 2;
	
	updateReloadButtonUi();
}

/* ------------------------------------------------------------------------ */

function handleBeforeacceptEvent(event) {
	if (window.$networkProxyShareProxySettings.value) {
		let types = ['ssl', 'ftp', 'socks', 'gopher'];
		let typesLength = types.length;
		
		for (let i = 0; i < typesLength; i += 1) {
			let type = types[i];
			let $proxyServerPref = document.getElementById('network.proxy.' + type);
			let $proxyPortPref = document.getElementById('network.proxy.' + type + '_port');
			let $proxyBackupServerPref = document.getElementById('network.proxy.backup.' + type);
			let $proxyBackupPortPref = document.getElementById('network.proxy.backup.' + type + '_port');
			
			$proxyBackupServerPref.value = $proxyServerPref.value;
			$proxyBackupPortPref.value = $proxyPortPref.value;
			$proxyServerPref.value = window.$networkProxyHttp.value;
			$proxyPortPref.value = window.$networkProxyHttpPort.value;
		}
	}
}

window.addEventListener('beforeaccept', handleBeforeacceptEvent, false);

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.$networkProxyType = document.getElementById('network.proxy.type');
	window.$networkProxyHttp = document.getElementById('network.proxy.http');
	window.$networkProxyHttpPort = document.getElementById('network.proxy.http_port');
	window.$networkProxyShareProxySettings = document.getElementById('network.proxy.share_proxy_settings');
	window.$networkProxyNoProxiesOn = document.getElementById('network.proxy.no_proxies_on');
	window.$networkProxyAutoconfigUrl = document.getElementById('network.proxy.autoconfig_url');
	window.$networkProxySocksVersion = document.getElementById('network.proxy.socks_version');
	
	window.$networkProxyType.setAttribute('onchange', 'return updateUI();');
	
	document.getElementById('network-proxy-http').setAttribute('onsyncfrompreference', 'return readHttpProxyServer();');
	document.getElementById('network-proxy-http-port').setAttribute('onsyncfrompreference', 'return readHttpProxyPort();');
	document.getElementById('network-proxy-share-proxy-settings').setAttribute('onsyncfrompreference', 'return updateProtocolUi();');
	
	let types = ['ssl', 'ftp', 'socks', 'gopher'];
	let typesLength = types.length;
	
	for (let i = 0; i < typesLength; i += 1) {
		let type = types[i];
		
		document.getElementById('network-proxy-' + type).setAttribute('onsyncfrompreference', 'return readProxyProtocol("' + type + '", false);');
		document.getElementById('network-proxy-' + type + '-port').setAttribute('onsyncfrompreference', 'return readProxyProtocol("' + type + '", true);');
	}
	
	document.getElementById('network-proxy-autoconfig-url').setAttribute('oninput', 'return updateReloadButtonUi();');
	document.getElementById('network-proxy-autoconfig-reload-button').setAttribute('oncommand', 'return reloadPAC();');
	
	updateUI();
}

window.addEventListener('load', handleLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/