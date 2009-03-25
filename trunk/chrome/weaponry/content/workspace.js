// non-polluting function block
(function () {
	// parse query
	function parseQuery(q) {
		var o = {};
		var t = q.split('&');

		for (var i = 0; i < t.length; i++) {
			var p = t[i].split('=');
			o[unescape(p[0])] = unescape(p[1]);
		}

		return o;
	}

	// make a query object from the search parameter of the document's location
	var query = parseQuery(document.location.search.substring(1));

	// initialize workspace database
	if (query.workspacedb) { // if a workspacedb declaration is found...
		// ...get a reference to the directory service
		var file = Components.classes['@mozilla.org/file/directory_service;1']
		                     .getService(Components.interfaces.nsIProperties)
		                     .get('ProfD', Components.interfaces.nsIFile);

		file.append(query.workspacedb);

		// ...get a reference to the storage service
		var storageService = Components.classes['@mozilla.org/storage/service;1']
		                               .getService(Components.interfaces.mozIStorageService);

		// ...open database
		window.workspacedb = storageService.openDatabase(file);

		// TODO:...query for supported subspaces
	}

	// get a reference to the workspace page
	var page = document.getElementById('weaponry-workspace-page');

	// subspace generator
	if (query.subspaces) { // if subspace declarations are found...
		// ...foreach subspace name...
		for each (var subspace_name in query.subspaces.split(',')) {
			// ...create a new subspace
			var subspace = document.createElement('box');
			subspace.setAttribute('id', 'subspace-' + subspace_name);
			subspace.setAttribute('flex', '1');

			// ...append the new subspace to page
			page.appendChild(subspace);
		}
	}
})();
