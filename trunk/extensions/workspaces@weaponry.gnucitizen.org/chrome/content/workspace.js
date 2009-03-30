// workspace api
var workspace = {
	// get workspace option
	get_option: function (name) {
		try {
			var statement = window.workspacedb.createStatement('SELECT value FROM workspace_options WHERE key = ?1');
			statement.bindStringParameter(0, name);

			if (statement.executeStep()) {
				return statement.getString(0);
			}
		} catch (e) {
			return '';
		}
	},
	// get workspace options
	get_options: function (name) {
		try {
			var statement = window.workspacedb.createStatement('SELECT value FROM workspace_options WHERE key = ?1');
			statement.bindStringParameter(0, name);

			var retr = [];

			while (statement.executeStep()) {
				retr.push(statement.getString(0));
			}

			return retr;
		} catch (e) {
			return [];
		}
	}
};

// non-polluting function block
(function () {
	// parse query
	function parse_query(q) {
		var o = {};
		var t = q.split('&');

		for (var i = 0; i < t.length; i++) {
			var p = t[i].split('=');
			o[unescape(p[0])] = unescape(p[1]);
		}

		return o;
	}

	// make a query object from the search parameter of the document's location
	var query = parse_query(document.location.search.substring(1));

	// merge window.arguments[0] with query
	if (window.arguments && window.arguments.length > 0) { // if arguments are passed...
		// ...update query
		for (var i in window.arguments[0]) { // foreach item in the first argument...
			// ...update query with item value
			query[i] = window.arguments[0][i];
		}
	}

	// initialize workspace database
	if (query.workspacedb) { // if a workspacedb declaration is found...
		// ...open worksace
		try { // try...
			// ...get a reference to a file
			var file = Components.classes['@mozilla.org/file/local;1']
					     .createInstance(Components.interfaces.nsILocalFile);

			// ...init file with workspacedb path
			file.initWithPath(query.workspacedb);

			// ...check for workspace existance
			if (!file.exists()) { // if workspace does not exist...
				// ...throw an exception
				throw 'Workspace Not Found!';
			}
		} catch(e) { // else if exception was thrown...
			// ...get a reference to the directory service
			var file = Components.classes['@mozilla.org/file/directory_service;1']
					     .getService(Components.interfaces.nsIProperties)
					     .get('ProfD', Components.interfaces.nsIFile);

			// ..init file with workspacedb path
			file.append(query.workspacedb);

			// ...check for workspace existance
			if (!file.exists()) { // if workspace does not exist...
				// ...just return
				return;
			}
		}

		// ...get a reference to the storage service
		var storageService = Components.classes['@mozilla.org/storage/service;1']
		                               .getService(Components.interfaces.mozIStorageService);

		// ...open database
		window.workspacedb = storageService.openDatabase(file);

		// ...get workspace types
		var types = workspace.get_options('workspace.type');

		// ...add types to query subspaces
		if (query.subspaces) { // if there are subspaces in the query...
			// ...append types to subspaces
			query.subspaces += types.join(',');
		} else { // otherwise...
			// ...use types as query subspaces only
			query.subspaces = types.join(',');
		}
	} else { // else if no workspacedb was specified...
		// ...just return
		return;
	}

	// subspace generator
	if (query.subspaces) { // if subspace declarations are found...
		// ...declare subspaces
		window.subspaces = query.subspaces;
	} else { // else declare empty subpsaces
		window.subspaces = [];
	}
})();

// build environment
if (window.workspacedb) { // if there is a workspacedb...
	// ...get a reference to the workspace page
	var page = document.getElementById('workspace');

	// ...create subspaces
	for each (var subspace_name in window.subspaces.replace(/,+/g, ',').split(',')) { // foreach subspace name...
		// ...create a new subspace
		var subspace = document.createElement('box');
		subspace.setAttribute('id', 'subspace-' + subspace_name);
		subspace.setAttribute('flex', '1');

		// ...append the new subspace to page
		page.appendChild(subspace);
	}

	// ...load event
	window.addEventListener('load', function () {
		// change the title of the document to the name of the workspace
		document.title = workspace.get_option('workspace.name');
	}, true);
}
