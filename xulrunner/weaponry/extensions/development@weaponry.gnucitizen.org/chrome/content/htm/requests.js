/**
 *  requests.js
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

Components.utils.import('resource://org.gnucitizen.weaponry.common/content/mod/weaponryCommon.jsm');
Components.utils.import('resource://org.gnucitizen.weaponry.development/content/mod/weaponryDevelopment.jsm');

/* ------------------------------------------------------------------------ */

$(document).ready(function () {
	let bundle = weaponryCommon.getBundle('chrome://org.gnucitizen.weaponry.development/locale/htm/requests.properties');
	
	document.title = bundle.formatStringFromName('page-title', [weaponryCommon.xulAppInfo.name], 1);
	
	window.httpResponseObserver = weaponryCommon.createHttpObserver(false, true, function (httpChannel, channelWindow, originWindow) {
		let requestParts = weaponryCommon.getHttpChannelRequestParts(httpChannel);
		let responseParts = weaponryCommon.getHttpChannelResponseParts(httpChannel);
		
		let $item = $('<div class="item"><span class="code">...</span> <span class="method">...</span> <span class="url">...</span></div>');
		
		$item.children('.code').text(responseParts.code);
		$item.children('.method').text(requestParts.method);
		$item.children('.url').text(requestParts.url);
		
		$('body').append($item);
	});
	
	window.httpResponseObserver.install(window);
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/