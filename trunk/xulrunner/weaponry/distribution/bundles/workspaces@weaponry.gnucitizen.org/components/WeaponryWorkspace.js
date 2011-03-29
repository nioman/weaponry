/**
 *  WeaponryWorkspace.js
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

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

const CHROMEBASE = 'workspaces.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryWorkspace() {
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
	this.workspacePrototype = this;
	this.id = 'workspace-' + (new Date()).getTime() + Math.random().toString().substring(2);
	this.updatedTables = {};
	this.tableUpdateTimer = null;
	this.connection = null;
	this.utilityStatement = null;
}

WeaponryWorkspace.prototype = {
	classDescription: 'Weaponry Workspace',
	classID: Components.ID('{f6a2fab0-045d-11df-8a39-0800200c9a66}'),
	contractID: '@workspaces.weaponry.gnucitizen.org/workspace;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryWorkspace, CI.IWeaponryWorkspacePrototype, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function (subject, topic, data) {
		if (topic == 'timer-callback') {
			let timer = subject.QueryInterface(CI.nsITimer);
			
			if (timer != this.tableUpdateTimer) {
				return;
			}
			
			for (let table in this.updatedTables) {
				this.observerService.notifyObservers(this, 'weaponry-workspace-table-updated', table);
			}
			
			this.updatedTables = {};
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareConnection: function (connection) {
		this.connection = connection;
		
		this.connection.createFunction('jsonField', 2, function (parameters) {
			let jsonData = parameters.getString(0);
			let jsonField = parameters.getString(1);
			let data = JSON.parse(jsonData);
			
			return jsonField in data ? data[jsonField] : '';
		});
		
		this.executeStatement('CREATE TABLE IF NOT EXISTS properties (key TEXT UNIQUE, value TEXT)', null);
		
		this.utilityStatement = this.connection.createStatement('SELECT 1');
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-connection-prepared', null);
	},
	
	/* -------------------------------------------------------------------- */
	
	initWithConnection: function (connection) {
		this.prepareConnection(connection);
		
		this.create();
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-initialized', null);
	},
	
	initWithFile: function (file) {
		let connection = CC['@mozilla.org/storage/service;1'].getService(CI.mozIStorageService).openDatabase(file);
		
		this.initWithConnection(connection);
	},
	
	initWithName: function (name) {
		this.__name = name;
		
		this.__defineGetter__('file', function () {
			throw new Error('unsupported operation');
		});
		
		this.__defineGetter__('name', function () {
			return this.__name;
		});
		
		this.__defineGetter__('path', function () {
			throw new Error('unsupported operation');
		})
		
		this.__defineGetter__('fileUrl', function () {
			throw new Error('unsupported operation');
		});
		
		this.rename = function (name) {
			this.observerService.notifyObservers(this, 'weaponry-workspace-to-be-renamed', name);
			
			let oldName = this.__name;
			
			this.__name = name;
			
			self.observerService.notifyObservers(this, 'weaponry-workspace-renamed', oldName);
		};
		
		this.delete = function () {
			throw new Error('unsupported operation');
		};
		
		let connection = CC['@mozilla.org/storage/service;1'].openSpecialDatabase('memory');
		
		this.initWithConnection(connection);
	},
	
	/* -------------------------------------------------------------------- */
	
	create: function () {
		this.create = function () {
			// pass
		};
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-to-be-created', null);
		
		let preferencesService = CC['@mozilla.org/preferences-service;1'].getService(CI.nsIPrefBranch);
		
		this.tableUpdateTimer = CC['@mozilla.org/timer;1'].createInstance(CI.nsITimer);
		
		let tabelUpdateInterval = preferencesService.getIntPref('org.gnucitizen.weaponry.workspaces.tableUpdateInterval');
		
		this.tableUpdateTimer.init(this, tabelUpdateInterval, CI.nsITimer.TYPE_REPEATING_SLACK);
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-created', null);
	},
	
	destroy: function () {
		this.destroy = function () {
			// pass
		};
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-to-be-destroyed', null);
		
		if (this.tableUpdateTimer) {
			this.tableUpdateTimer.cancel();
		}
		
		this.executeStatementFast = function () {
			// pass
		};
		
		this.executeStatementAsynchronouslyFast = function () {
			// pass
		};
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-destroyed', null);
	},
	
	/* -------------------------------------------------------------------- */
	
	get file () {
		return this.connection.databaseFile;
	},
	
	/* -------------------------------------------------------------------- */
	
	get name () {
		return this.file.leafName.toString().replace(/\.workspace$/, '');
	},
	
	/* -------------------------------------------------------------------- */
	
	get path () {
		return this.file.path;
	},
	
	/* -------------------------------------------------------------------- */
	
	get fileUrl () {
		return CC['@mozilla.org/network/io-service;1'].getService(CI.nsIIOService).newFileURI(this.connection.databaseFile).spec;
	},
	
	/* -------------------------------------------------------------------- */
	
	get thumbnailUri () {
		let thumbnailUri = this.getPropertyFast('thumbnail.uri');
		
		if (thumbnailUri) {
			return thumbnailUri.value;
		} else {
			return '';
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	sameAs: function (workspace) {
		return this.id == workspace.id;
	},
	
	/* -------------------------------------------------------------------- */
	
	rename: function (name) {
		let workspacesService = CC['@workspaces.weaponry.gnucitizen.org/service;1'].getService(CI.IWeaponryWorkspacesService);
		let newFile = this.file.parent;
		
		newFile.append(workspacesService.getWorkspaceFilename(name));
		
		if (newFile.exists()) {
			throw new Error('workspace already exists: ' + name);
		}
		
		let oldName = this.name;
		
		this.observerService.notifyObservers(this, 'weaponry-workspace-to-be-renamed', name);
		
		let file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
		
		file.initWithPath(this.path);
		
		let self = this;
		
		let doRename = function () {
			try {
				file.moveTo(null, workspacesService.getWorkspaceFilename(name));
				
				if (file.leafName == oldName) {
					throw new Error('file not renamed');
				}
			} catch (e) {
				Components.utils.reportError(e);
				
				self.connection = CC['@mozilla.org/storage/service;1'].getService(CI.mozIStorageService).openDatabase(file);
				
				throw new Error('workspace cannot be renamed: ' + file.path);
			}
			
			self.prepareConnection(CC['@mozilla.org/storage/service;1'].getService(CI.mozIStorageService).openDatabase(newFile));
			
			self.observerService.notifyObservers(self, 'weaponry-workspace-renamed', oldName);
		};
		
		if ('asyncClose' in this.connection) {
			try {
				this.connection.asyncClose(doRename);
			} catch (e) {
				doRename();
			}
		} else {
			try {
				this.connection.close();
			} catch (e) {
				// pass
			}
			
			doRename();
		}
	},
	
	delete: function () {
		this.observerService.notifyObservers(this, 'weaponry-workspace-to-be-deleted', null);
		
		let file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
		
		file.initWithPath(this.connection.databaseFile.path);
		
		let self = this;
		
		let doDelete = function () {
			try {
				file.remove(false);
				
				if (file.exists()) {
					throw new Error('file not deleted');
				}
			} catch (e) {
				Components.utils.reportError(e);
				
				self.prepareConnection(CC['@mozilla.org/storage/service;1'].getService(CI.mozIStorageService).openDatabase(file));
				
				throw new Error('workspace cannot be deleted: ' + file.path);
			}
			
			self.observerService.notifyObservers(self, 'weaponry-workspace-deleted', null);
			
			self.destroy();
		};
		
		if ('asyncClose' in this.connection) {
			try {
				this.connection.asyncClose(doDelete);
			} catch (e) {
				doDelete();
			}
		} else {
			try {
				this.connection.close();
			} catch (e) {
				// pass
			}
			
			doDelete();
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	getWindow: function () {
		let windowMediator = CC['@mozilla.org/appshell/window-mediator;1'].getService(CI.nsIWindowMediator);
		let enumerator = windowMediator.getEnumerator(CHROMEBASE + ':workspace-window');
		
		while (enumerator.hasMoreElements()) {
			let window = enumerator.getNext();
			
			if (window.workspace && window.workspace.sameAs(this)) {
				return window;
			}
		}
	},
	
	openWindow: function () {
		let window = this.getWindow();
		
		if (window) {
			window.focus();
			
			return window;
		}
		
		let windowWatcher = CC['@mozilla.org/embedcomp/window-watcher;1'].getService(CI.nsIWindowWatcher);
		let window = windowWatcher.openWindow(null, 'chrome://' + CHROMEBASE + '/content/xul/workspaceWindow.xul', null, 'all,chrome,resizable', null);
		
		window.workspace = CC['@workspaces.weaponry.gnucitizen.org/service;1'].getService(CI.IWeaponryWorkspacesService).getWorkspace(this.name);
		
		return window;
	},
	
	/* -------------------------------------------------------------------- */
	
	executeStatementFast: function (expression, parameters) {
		if (!this.connection.connectionReady) {
			return [];
		}
		
		let items = [];
		let statement = this.connection.createStatement(expression);
		
		try {
			if (!parameters) {
				parameters = {};
			}
			
			if (parameters) {
				for (let parameter in parameters) {
					statement.params[parameter] = parameters[parameter];
				}
			}
			
			if ((/^\s*(create|insert|update|delete)\s+/i).test(expression)) {
				statement.executeStep();
			} else {
				let columns = [];
				
				for (let i = 0; i < statement.columnCount; i += 1) {
					columns.push(statement.getColumnName(i));
				}
				
				let columnsLength = columns.length;
				
				while (statement.executeStep()) {
					let item = {};
					
					for (let i = 0; i < columnsLength; i += 1) {
						let columnName = columns[i];
						let columnValue = statement.row[columnName];
						
						item[columnName] = columnValue;
					}
					
					items.push(item);
				}
			}
		} catch (e) {
			Components.utils.reportError(e);
			
			throw e;
		} finally {
			statement.finalize();
		}
		
		return items;
	},
	
	executeStatement: function (expression, parameters) {
		if (parameters) {
			parameters = JSON.parse(parameters);
		} else {
			parameters = {};
		}
		
		let items = CC['@mozilla.org/array;1'].createInstance(CI.nsIMutableArray);
		let results = this.executeStatementFast(expression, parameters);
		let resultsLength = results.length;
		
		let i, item;
		
		for (i = 0; i < resultsLength; i += 1) {
			item = CC['@mozilla.org/variant;1'].createInstance(CI.nsIWritableVariant);
			
			item.setFromVariant(JSON.stringify(results[i]));
			
			items.appendElement(item, false);
		}
		
		return items.enumerate();
	},
	
	executeStatementAsynchronouslyFast: function (expression, parameters, resultHandler, completionHandler, errorHandler) {
		if (!this.connection.connectionReady) {
			return;
		}
		
		let statement = this.connection.createStatement(expression);
		
		if (!parameters) {
			parameters = {};
		}
		
		if (parameters) {
			for (let parameter in parameters) {
				statement.params[parameter] = parameters[parameter];
			}
		}
		
		let columns = [];
		
		for (let i = 0; i < statement.columnCount; i += 1) {
			columns.push(statement.getColumnName(i));
		}
		
		let columnsLength = columns.length;
		
		let self = this;
		
		statement.executeAsync({
			handleResult: function (result) {
				for (let row = result.getNextRow(); row; row = result.getNextRow()) {
					if (resultHandler) {
						let item = {};
						
						let i, columnName, columnValue;
						
						for (i = 0; i < columnsLength; i += 1) {
							columnName = columns[i];
							columnValue = row.getResultByIndex(i);
							
							item[columnName] = columnValue;
						}
						
						resultHandler(item, self);
					}
				}
			},
			
			handleError: function (error) {
				if (errorHandler) {
					errorHandler(error, self);
				}
			},
			
			handleCompletion: function (reason) {
				if (completionHandler) {
					completionHandler(reason, self);
				}
			}
		});
	},
	
	executeStatementAsynchronously: function (expression, parameters, resultHandler, completionHandler, errorHandler) {
		if (parameters) {
			parameters = JSON.parse(parameters);
		} else {
			parameters = {};
		}
		
		let self = this;
		
		this.executeStatementAsynchronouslyFast(
			expression,
			parameters,
			
			function (result, workspace) {
				resultHandler.handle(self.JSON.stringify(result), workspace);
			},
			
			function (reason, workspace) {
				if (completionHandler) {
					completionHandler.handle(reason, workspace);
				}
			},
			
			function (error, workspace) {
				if (errorHandler) {
					errorHandler.handle(error, workspace);
				}
			}
		);
	},
	
	/* -------------------------------------------------------------------- */
	
	getPropertyFast: function (key) {
		let results = this.executeStatementFast('SELECT key, value FROM properties WHERE key=:key LIMIT 1', {key:key});
		
		if (results.length > 0) {
			return results[0];
		} else {
			return null;
		}
	},
	
	getProperty: function (key) {
		let results = this.executeStatementFast('SELECT key, value FROM properties WHERE key=:key LIMIT 1', {key:key});
		
		if (results.length > 0) {
			return results[0];
		} else {
			return '';
		}
	},
	
	getPropertyAsynchronouslyFast: function (key, resultHandler, completionHandler) {
		return this.executeStatementAsynchronouslyFast('SELECT key, value FROM properties WHERE key=:key LIMIT 1', {key:key}, resultHandler, completionHandler);
	},
	
	getPropertyAsynchronously: function (key, resultHandler, completionHandler) {
		return this.executeStatementAsynchronouslyFast('SELECT key, value FROM properties WHERE key=:key LIMIT 1', {key:key}, resultHandler, completionHandler);
	},
	
	/* -------------------------------------------------------------------- */
	
	setPropertyFast: function (key, value) {
		return this.executeStatementFast('INSERT OR REPLACE INTO properties VALUES(:key, :value)', {key:key, value:value});
	},
	
	setProperty: function (key, value) {
		return this.executeStatementFast('INSERT OR REPLACE INTO properties VALUES(:key, :value)', {key:key, value:value});
	},
	
	setPropertyAsynchronouslyFast: function (key, value, completionHandler) {
		return this.executeStatementAsynchronouslyFast('INSERT OR REPLACE INTO properties VALUES(:key, :value)', {key:key, value:value}, null, completionHandler);
	},
	
	setPropertyAsynchronously: function (key, value, completionHandler) {
		return this.executeStatementAsynchronouslyFast('INSERT OR REPLACE INTO properties VALUES(:key, :value)', {key:key, value:value}, null, completionHandler);
	},
	
	/* -------------------------------------------------------------------- */
	
	delPropertyFast: function (key) {
		return this.executeStatementFast('DELETE FROM properties WHERE key = :key', {key:key});
	},
	
	delProperty: function (key) {
		return this.executeStatementFast('DELETE FROM properties WHERE key = :key', {key:key});
	},
	
	delPropertyAsynchronouslyFast: function (key, completionHandler) {
		return this.executeStatementAsynchronouslyFast('DELETE FROM properties WHERE key = :key', {key:key}, null, completionHandler);
	},
	
	delPropertyAsynchronously: function (key, completionHandler) {
		return this.executeStatementAsynchronouslyFast('DELETE FROM properties WHERE key = :key', {key:key}, null, completionHandler);
	},
	
	/* -------------------------------------------------------------------- */
	
	escapeForLike: function (input) {
		return this.utilityStatement.escapeStringForLIKE(input, '/');
	},
	
	/* -------------------------------------------------------------------- */
	
	enumeratePropertiesFast: function (lookup) {
		return this.executeStatementFast('SELECT key, value FROM properties WHERE key LIKE :lookup ESCAPE "/"', {lookup:this.escapeForLike(lookup + '%')});
	},
	
	enumerateProperties: function (lookup) {
		return this.executeStatement('SELECT key, value FROM properties WHERE key LIKE :lookup ESCAPE "/"', JSON.stringify({lookup:this.escapeForLike(lookup + '%')}));
	},
	
	enumeratePropertiesAsynchronouslyFast: function (lookup, resultHandler, completionHandler) {
		return this.executeStatementAsynchronouslyFast('SELECT key, value FROM properties WHERE key LIKE :lookup ESCAPE "/"', {lookup:this.escapeForLike(lookup + '%')}, resultHandler, completionHandler);
	},
	
	enumeratePropertiesAsynchronously: function (lookup, resultHandler, completionHandler) {
		return this.executeStatementAsynchronously('SELECT key, value FROM properties WHERE key LIKE :lookup ESCAPE "/"', JSON.stringify({lookup:this.escapeForLike(lookup + '%')}), resultHandler, completionHandler);
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareTableParameters: function (parameters, isFast) {
		if (parameters) {
			return isFast ? parameters : JSON.parse(parameters);
		} else {
			return {};
		}
	},
	
	prepareWhereTableItemStatement: function (table, parameters) {
		let rowIdName = '';
		let where = '';
		
		if (parameters._ROWID_ != undefined) {
			rowIdName = '_ROWID_';
			where = ' WHERE _ROWID_ = :_ROWID_';
		} else {
			throw new Error('_ROWID_ parameter was not specified');
		}
		
		return {
			rowIdName: rowIdName,
			where: where,
		};
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareRetrieveTableItemStatement: function (table, parameters, isFast) {
		let parameters = this.prepareTableParameters(parameters, isFast);
		let whereStatement = this.prepareWhereTableItemStatement(table, parameters);
		let query = 'SELECT _ROWID_ as _ROWID_, * FROM \'' + table.replace(/'/g, '\\\'') + '\'' +  whereStatement.where + ' LIMIT 1';
		
		return {
			rowId: parameters[whereStatement.rowIdName],
			query: query,
			parameters: isFast ? parameters : JSON.stringify(parameters),
		};
	},
	
	retrieveTableItemFast: function (table, parameters) {
		let statement = this.prepareRetrieveTableItemStatement(table, parameters, true);
		let enumerator = this.executeStatementFast(statement.query, statement.parameters);
		
		if (enumerator.length > 0) {
			return enumerator[0];
		}
		
		return {};
	},
	
	retrieveTableItem: function (table, parameters) {
		let statement = this.prepareRetrieveTableItemStatement(table, parameters, false);
		let enumerator = this.executeStatement(statement.query, statement.parameters);
		
		if (enumerator.hasMoreElements()) {
			return enumerator.getNext().QueryInterface(CI.nsIVariant).getAsAString();
		}
		
		return '';
	},
	
	retrieveTableItemAsynchronouslyFast: function (table, parameters, resultHandler, completionHandler) {
		let statement = this.prepareRetrieveTableItemStatement(table, parameters, true);
		
		return this.executeStatementAsynchronouslyFast(statement.query, statement.parameters, resultHandler, function (reason, workspace) {
			if (completionHandler) {
				completionHandler(statement.rowId, workspace);
			}
		});
	},
	
	retrieveTableItemAsynchronously: function (table, parameters, resultHandler, completionHandler) {
		let statement = this.prepareRetrieveTableItemStatement(table, parameters, false);
		
		return this.executeStatementAsynchronously(statement.query, statement.parameters, resultHandler, function (reason, workspace) {
			if (completionHandler) {
				completionHandler.handle(statement.rowId, workspace);
			}
		});
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareInsertTableItemStatement: function (table, parameters, isFast) {
		let parameters = this.prepareTableParameters(parameters, isFast);
		let paramClause = [];
		let valueClause = [];
		
		for (let parameter in parameters) {
			if (parameter != '_ROWID_') {
				let escapedParameterForParam = '\'' + parameter.replace(/'/g, '\\\'') + '\'';
				
				// TODO: make proper value escape
				let escapedParameterForValue = ':' + parameter.replace(/\W/g, '');
				//
				
				paramClause.push(escapedParameterForParam);
				valueClause.push(escapedParameterForValue);
			}
		}
		
		let query = 'INSERT INTO \'' + table.replace(/'/g, '\\\'') + '\' (' + paramClause.join(',') + ') VALUES (' + valueClause.join(',') + ')';
		
		return {
			query: query,
			parameters: isFast ? parameters : JSON.stringify(parameters),
		}
	},
	
	insertTableItemFast: function (table, parameters) {
		let statement = this.prepareInsertTableItemStatement(table, parameters, true);
		
		this.executeStatementFast(statement.query, statement.parameters);
		
		this.updatedTables[table] = true;
		
		return this.connection.lastInsertRowID;
	},
	
	insertTableItem: function (table, parameters) {
		let statement = this.prepareInsertTableItemStatement(table, parameters, false);
		
		this.executeStatement(statement.query, statement.parameters);
		
		this.updatedTables[table] = true;
		
		return this.connection.lastInsertRowID;
	},
	
	insertTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
		let self = this;
		let statement = this.prepareInsertTableItemStatement(table, parameters, true);
		
		return this.executeStatementAsynchronouslyFast(statement.query, statement.parameters, null,
			function (reason, workspace) {
				self.updatedTables[table] = true;
				
				if (completionHandler) {
					completionHandler(workspace.connection.lastInsertRowID, workspace);
				}
			}
		);
	},
	
	insertTableItemAsynchronously: function (table, parameters, completionHandler) {
		let self = this;
		let statement = this.prepareInsertTableItemStatement(table, parameters, false);
		
		return this.executeStatementAsynchronously(statement.query, statement.parameters, null,
			function (reason, workspace) {
				self.updatedTables[table] = true;
				
				if (completionHandler) {
					completionHandler.handle(workspace.connection.lastInsertRowID, workspace);
				}
			}
		);
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareUpdateTableItemStatement: function (table, parameters, isFast) {
		let parameters = this.prepareTableParameters(parameters, isFast);
		let setClause = [];
		
		for (let parameter in parameters) {
			if (parameter != '_ROWID_') {
				let escapedParameterForParam = '\'' + parameter.replace(/'/g, '\\\'') + '\'';
				
				// TODO: make proper value escape
				let escapedParameterForValue = ':' + parameter.replace(/\W/g, '');
				//
				
				setClause.push(escapedParameterForParam + ' = ' + escapedParameterForValue);
			}
		}
		
		if (setClause.length == 0) {
			return;
		}
		
		let whereStatement = this.prepareWhereTableItemStatement(table, parameters);
		let query = 'UPDATE \'' + table.replace(/'/g, '\\\'') + '\' SET ' + setClause.join(', ') + whereStatement.where;
		
		return {
			rowId: parameters[whereStatement.rowIdName],
			query: query,
			parameters: isFast ? parameters : JSON.stringify(parameters),
		};
	},
	
	updateTableItemFast: function (table, parameters) {
		let statement = this.prepareUpdateTableItemStatement(table, parameters, true);
		
		this.executeStatementFast(statement.query, statement.parameters);
		
		this.updatedTables[table] = true;
		
		return statement.rowId;
	},
	
	updateTableItem: function (table, parameters) {
		let statement = this.prepareUpdateTableItemStatement(table, parameters, false);
		
		this.executeStatement(statement.query, statement.parameters);
		
		this.updatedTables[table] = true;
		
		return statement.rowId;
	},
	
	updateTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
		let self = this;
		let statement = this.prepareUpdateTableItemStatement(table, parameters, true);
		
		return this.executeStatementAsynchronouslyFast(statement.query, statement.parameters, null,
			function (reason, workspace) {
				self.updatedTables[table] = true;
				
				if (completionHandler) {
					completionHandler(statement.rowId, workspace);
				}
			}
		);
	},
	
	updateTableItemAsynchronously: function (table, parameters, completionHandler) {
		let self = this;
		let statement = this.prepareUpdateTableItemStatement(table, parameters, false);
		
		return this.executeStatementAsynchronously(statement.query, statement.parameters, null,
			function (reason, workspace) {
				self.updatedTables[table] = true;
				
				if (completionHandler) {
					completionHandler.handle(statement.rowId, workspace);
				}
			}
		);
	},
	
	/* -------------------------------------------------------------------- */
	
	preparesDeleteTableItemStatement: function (table, parameters, isFast) {
		let parameters = this.prepareTableParameters(parameters, isFast);
		let whereStatement = this.prepareWhereTableItemStatement(table, parameters);
		let query = 'DELETE FROM \'' + table.replace(/'/g, '\\\'') + '\' ' + whereStatement.where;
		
		return {
			rowId: parameters[whereStatement.rowIdName],
			query: query,
			parameters: isFast ? parameters : JSON.stringify(parameters),
		};
	},
	
	deleteTableItemFast: function (table, parameters) {
		let statement = this.preparesDeleteTableItemStatement(table, parameters, true);
		
		this.executeStatementFast(statement.query, statement.parameters);
		
		this.updatedTables[table] = true;
		
		return statement.rowId;
	},
	
	deleteTableItem: function (table, parameters) {
		let statement = this.preparesDeleteTableItemStatement(table, parameters, false);
		
		this.executeStatement(statement.query, statement.parameters);
		
		this.updatedTables[table] = true;
		
		return statement.rowId;
	},
	
	deleteTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
		let self = this;
		let statement = this.preparesDeleteTableItemStatement(table, parameters, true);
		
		return this.executeStatementAsynchronouslyFast(statement.query, statement.parameters, null,
			function (reason, workspace) {
				self.updatedTables[table] = true;
				
				if (completionHandler) {
					completionHandler(statement.rowId, workspace);
				}
			}
		);
	},
	
	deleteTableItemAsynchronously: function (table, parameters, completionHandler) {
		let self = this;
		let statement = this.preparesDeleteTableItemStatement(table, parameters, false);
		
		return this.executeStatementAsynchronously(statement.query, statement.parameters, null,
			function (reason, workspace) {
				self.updatedTables[table] = true;
				
				if (completionHandler) {
					completionHandler.handle(statement.rowId, workspace);
				}
			}
		);
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareEnumerateTableItemsStatement: function (table, parameters, isFast) {
		let parameters = this.prepareTableParameters(parameters, isFast);
		let query = 'SELECT _ROWID_ as _ROWID_, * FROM \'' + table.replace(/'/g, '\\\'') + '\'';
		
		return {
			query: query,
			parameters: isFast ? parameters : JSON.stringify(parameters),
		};
	},
	
	enumerateTableItemsFast: function (table, parameters) {
		let statement = this.prepareEnumerateTableItemsStatement(table, parameters, true);
		
		return this.executeStatementFast(statement.query, statement.parameters);
	},
	
	enumerateTableItems: function (table, parameters) {
		let statement = this.prepareEnumerateTableItemsStatement(table, parameters, false);
		
		return this.executeStatement(statement.query, statement.parameters);
	},
	
	enumerateTableItemsAsynchronouslyFast: function (table, parameters, resultHandler, completionHandler) {
		let statement = this.prepareEnumerateTableItemsStatement(table, parameters, true);
		
		return this.executeStatementAsynchronouslyFast(statement.query, statement.parameters, resultHandler, function (reason, workspace) {
			if (completionHandler) {
				completionHandler(-1, workspace);
			}
		});
	},
	
	enumerateTableItemsAsynchronously: function (table, parameters, resultHandler, completionHandler) {
		let statement = this.prepareEnumerateTableItemsStatement(table, parameters, false);
		
		return this.executeStatementAsynchronously(statement.query, statement.parameters, resultHandler, function (reason, workspace) {
			if (completionHandler) {
				completionHandler.handle(-1, workspace);
			}
		});
	},
	
	/* -------------------------------------------------------------------- */
	
	getTableAPI: function (notificationPrefix) {
		let tableAPI = {
			QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryWorkspaceTableAPI]),
			
			recordNotification: notificationPrefix + '-item-recorded',
			updateNotification: notificationPrefix + '-item-updated',
			deleteNotification: notificationPrefix + '-item-deleted',
			
			workspace: this,
			
			observerService: CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService),
			
			retrieveTableItemFast: function (table, parameters) {
				return this.workspace.wrappedJSObject.retrieveTableItemFast(table, parameters);
			},
			
			retrieveTableItem: function (table, parameters) {
				return this.workspace.retrieveTableItem(table, parameters);
			},
			
			retrieveTableItemAsynchronouslyFast: function (table, parameters, resultHandler, completionHandler) {
				return this.workspace.wrappedJSObject.retrieveTableItemAsynchronouslyFast(table, parameters, resultHandler, completionHandler);
			},
			
			retrieveTableItemAsynchronously: function (table, parameters, resultHandler, completionHandler) {
				return this.workspace.retrieveTableItemAsynchronously(table, parameters, resultHandler, completionHandler);
			},
			
			insertTableItemFast: function (table, parameters) {
				return this.workspace.wrappedJSObject.insertTableItemFast(table, parameters);
			},
			
			insertTableItem: function (table, parameters) {
				return this.workspace.insertTableItem(table, parameters);
			},
			
			insertTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
				return this.workspace.wrappedJSObject.insertTableItemAsynchronouslyFast(table, parameters, completionHandler);
			},
			
			insertTableItemAsynchronously: function (table, parameters, completionHandler) {
				return this.workspace.insertTableItemAsynchronously(table, parameters, completionHandler);
			},
			
			recordTableItemFast: function (table, parameters) {
				let _ROWID_ = tableItemFast(workspace, parameters);
				
				this.observerService.notifyObservers(workspace, this.recordNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			recordTableItem: function (table, parameters) {
				let _ROWID_ = tableItem(workspace, parameters);
				
				this.observerService.notifyObservers(workspace, this.recordNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			recordTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
				let self = this;
				
				return tableItemAsynchronouslyFast(workspace, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.recordNotification, rowId);
					
					if (completionHandler) {
						completionHandler(rowId, workspace);
					}
				});
			},
			
			recordTableItemAsynchronously: function (table, parameters, completionHandler) {
				let self = this;
				
				return tableItemAsynchronously(workspace, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.recordNotification, rowId);
					
					if (completionHandler) {
						completionHandler.handle(rowId, workspace);
					}
				});
			},
			
			updateTableItemFast: function (table, parameters) {
				let _ROWID_ = this.workspace.wrappedJSObject.updateTableItemFast(table, parameters);
				
				this.observerService.notifyObservers(workspace, this.updateNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			updateTableItem: function (table, parameters) {
				let _ROWID_ = this.workspace.updateTableItem(table, parameters);
				
				this.observerService.notifyObservers(workspace, this.updateNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			updateTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
				let self = this;
				
				return this.workspace.wrappedJSObject.updateTableItemAsynchronouslyFast(table, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.updateNotification, rowId);
					
					if (completionHandler) {
						completionHandler(rowId, workspace);
					}
				});
			},
			
			updateTableItemAsynchronously: function (table, parameters, completionHandler) {
				let self = this;
				
				return this.workspace.updateTableItemAsynchronously(table, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.updateNotification, rowId);
					
					if (completionHandler) {
						completionHandler.handle(rowId, workspace);
					}
				});
			},
			
			deleteTableItemFast: function (table, parameters) {
				let _ROWID_ = this.workspace.wrappedJSObject.deleteTableItemFast(table, parameters);
				
				this.observerService.notifyObservers(workspace, this.deleteNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			deleteTableItem: function (table, parameters) {
				let _ROWID_ = this.workspace.deleteTableItem(table, parameters);
				
				this.observerService.notifyObservers(workspace, this.deleteNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			deleteTableItemAsynchronouslyFast: function (table, parameters, completionHandler) {
				let self = this;
				
				return this.workspace.wrappedJSObject.deleteTableItemAsynchronouslyFast(table, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.deleteNotification, rowId);
					
					if (completionHandler) {
						completionHandler(rowId, workspace);
					}
				});
			},
			
			deleteTableItemAsynchronously: function (table, parameters, completionHandler) {
				let self = this;
				
				return this.workspace.deleteTableItemAsynchronously(table, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.deleteNotification, rowId);
					
					if (completionHandler) {
						completionHandler.handle(rowId, workspace);
					}
				});
			},
			
			enumerateTableItemsFast: function (table, parameters) {
				return this.workspace.wrappedJSObject.enumerateTableItems(table, parameters);
			},
			
			enumerateTableItems: function (table, parameters) {
				return this.workspace.enumerateTableItems(table, parameters);
			},
			
			enumerateTableItemsAsynchronouslyFast: function (table, parameters, resultHandler, completionHandler) {
				return this.workspace.wrappedJSObject.enumerateTableItemsAsynchronouslyFast(table, parameters, resultHandler, completionHandler);
			},
			
			enumerateTableItemsAsynchronously: function (table, parameters, resultHandler, completionHandler) {
				return this.workspace.enumerateTableItemsAsynchronously(table, parameters, resultHandler, completionHandler);
			}
		};
		
		tableAPI.wrappedJSObject = tableAPI;
		
		return tableAPI;
	}
};

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryWorkspace]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([WeaponryWorkspace]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/