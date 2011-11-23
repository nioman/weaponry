setTimeout(function () {
	let ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	let externalProtocolService = Components.classes['@mozilla.org/uriloader/external-protocol-service;1'].getService(Components.interfaces.nsIExternalProtocolService);
	let urls = ['mailto:test', 'feed:test', 'http:test', 'https:test', 'ftp:test'];
	
	for (let i = 0; i < urls.length; i += 1) {
		let uri = urls[i];
		let newUri = ioService.newURI(uri, null, null);
		
		externalProtocolService.loadURI(newUri, null);
	}
}, 1000);