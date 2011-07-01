/**
 *  WeaponryWorkspacesService.js
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

function WeaponryWorkspacesService() {
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
}

WeaponryWorkspacesService.prototype = {
	classDescription: 'Weaponry Workspaces Service',
	classID: Components.ID('{ff50cfc0-045d-11df-8a39-0800200c9a66}'),
	contractID: '@workspaces.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryWorkspacesService]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	getWorkspacesDirectory: function () {
		let directory = CC['@mozilla.org/file/directory_service;1'].getService(CI.nsIProperties).get('ProfD', CI.nsIFile);
		
		directory.append('workspaces');
		
		if (!directory.exists()) {
			directory.create(CI.nsIFile.DIRECTORY_TYPE, 0775);
		}
		
		return directory;
	},
	
	/* -------------------------------------------------------------------- */
	
	getWorkspaceFilename: function (name) {
		return name + '.workspace';
	},
	
	/* -------------------------------------------------------------------- */
	
	getWorkspaceFile: function (name) {
		let file = this.getWorkspacesDirectory();
		
		file.append(this.getWorkspaceFilename(name));
		
		return file;
	},
	
	/* -------------------------------------------------------------------- */
	
	getWorkspace: function (name) {
		let file = this.getWorkspaceFile(name);
		
		if (!file.exists()) {
			throw new Error('workspace does not exist: ' + name);
		}
		
		let workspacesManager = CC['@workspaces.weaponry.gnucitizen.org/manager;1'].getService(CI.IWeaponryWorkspacesManager);
		let workspace = workspacesManager.getRegisteredWorkspaceByName(name);
		
		if (!workspace) {
			workspace = CC['@workspaces.weaponry.gnucitizen.org/workspace;1'].createInstance(CI.IWeaponryWorkspace);
			
			workspace.initWithFile(file);
		}
		
		return workspace;
	},
	
	/* -------------------------------------------------------------------- */
	
	createWorkspace: function (name) {
		let file = this.getWorkspaceFile(name);
		
		if (file.exists()) {
			throw new Error('workspace already exists: ' + name);
		}
		
		let workspace = CC['@workspaces.weaponry.gnucitizen.org/workspace;1'].createInstance(CI.IWeaponryWorkspace);
		
		workspace.initWithFile(file);
		
		if (!file.exists()) {
			throw new Error('workspace cannot be created: ' + name);
		}
		
		return workspace;
	},
	
	/* -------------------------------------------------------------------- */
	
	destroyWorkspace: function (name) {
		this.getWorkspace(name).destroy();
	},
	
	/* -------------------------------------------------------------------- */
	
	renameWorkspace: function (name, newName) {
		this.getWorkspace(name).rename(newName);
	},
	
	deleteWorkspace: function (name) {
		this.getWorkspace(name).delete();
	},
	
	/* -------------------------------------------------------------------- */
	
	getWorkspaceWindow: function (name) {
		return this.getWorkspace(name).getWindow();
	},
	
	openWorkspaceWindow: function (name) {
		return this.getWorkspace(name).openWindow();
	},
	
	/* -------------------------------------------------------------------- */
	
	importWorkspace: function (file, name) {
		if (!file.exists()) {
			throw new Error('file does not exist: ' + file.path);
		}
		
		let workspaceName = '';
		
		if (name) {
			workspaceName = name;
		} else {
			workspaceName = file.leafName.toString().replace(/\.workspace$/, '');
		}
		
		let workspaceFile = this.getWorkspaceFile(workspaceName);
		
		if (workspaceFile.exists()) {
			throw new Error('workspace already exists: ' + workspaceFile.path);
		}
		
		this.observerService.notifyObservers(file, 'workspace-to-be-imported', workspaceName);
		
		file.copyTo(this.getWorkspacesDirectory(), workspaceName + '.workspace');
		
		let workspace = this.getWorkspace(name);
		
		this.observerService.notifyObservers(workspace, 'weaponry-workspace-imported', null);
		
		return workspace;
	},
	
	exportWorkspace: function (name, file) {
		let workspace = this.getWorkspace(name);
		
		this.observerService.notifyObservers(workspace, 'workspace-to-be-exported', file.path);
		
		workspace.file.copyTo(file.parent, file.leafName);
		
		this.observerService.notifyObservers(workspace, 'weaponry-workspace-exported', file.path);
		
		return workspace;
	},
	
	/* -------------------------------------------------------------------- */
	
	enumerateWorkspaces: function () {
		let workspaces = CC['@mozilla.org/array;1'].createInstance(CI.nsIMutableArray);
		let dir = this.getWorkspacesDirectory();
		let enumerator = dir.directoryEntries.QueryInterface(CI.nsIDirectoryEnumerator);
		
		while (true) {
			let file = enumerator.nextFile;
			
			if (!file) {
				break;
			}
			
			let fileName = file.leafName.toString();
			
			if (!file.isDirectory() && !(/\.workspace$/).test(fileName)) {
				continue;
			}
			
			let workspace = this.getWorkspace(fileName.split('.').slice(0, -1).join('.'));
			
			workspaces.appendElement(workspace.QueryInterface(CI.nsISupports), false);
		}
		
		return workspaces.enumerate();
	},
	
	enumerateWorkspacesAsynchronously: function (handler, completionHandler) {
		let enumerator = this.enumerateWorkspaces();
		
		while (enumerator.hasMoreElements()) {
			handler.handle(enumerator.getNext());
		}
		
		if (completionHandler) {
			completionHandler.handle();
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	openWorkspacesWindow: function () {
		let windowMediator = CC['@mozilla.org/appshell/window-mediator;1'].getService(CI.nsIWindowMediator);
		let window = windowMediator.getMostRecentWindow(CHROMEBASE + ':workspaces-window');
		
		if (window) {
			window.focus();
			
			return window;
		}
		
		let windowWatcher = CC['@mozilla.org/embedcomp/window-watcher;1'].getService(CI.nsIWindowWatcher);
		
		return windowWatcher.openWindow(null, 'chrome://' + CHROMEBASE + '/content/xul/workspacesWindow.xul', null, 'all,chrome,resizable', null);
	},
	
	/* -------------------------------------------------------------------- */
	
	getTableAPI: function (table, notificationPrefix) {
		let tableAPI = {
			QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryWorkspaceTableAPI]),
			
			retrieveTable: table,
			insertTable: table,
			updateTable: table,
			deleteTable: table,
			enumerateTable: table,
			
			recordNotification: notificationPrefix + '-item-recorded',
			updateNotification: notificationPrefix + '-item-updated',
			deleteNotification: notificationPrefix + '-item-deleted',
			
			observerService: CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService),
			
			retrieveTableItemFast: function (workspace, parameters) {
				return workspace.wrappedJSObject.retrieveTableItemFast(this.retrieveTable, parameters);
			},
			
			retrieveTableItem: function (workspace, parameters) {
				return workspace.retrieveTableItem(this.retrieveTable, parameters);
			},
			
			retrieveTableItemAsynchronouslyFast: function (workspace, parameters, resultHandler, completionHandler) {
				return workspace.wrappedJSObject.retrieveTableItemAsynchronouslyFast(this.retrieveTable, parameters, resultHandler, completionHandler);
			},
			
			retrieveTableItemAsynchronously: function (workspace, parameters, resultHandler, completionHandler) {
				return workspace.retrieveTableItemAsynchronously(this.retrieveTable, parameters, resultHandler, completionHandler);
			},
			
			insertTableItemFast: function (workspace, parameters) {
				return workspace.wrappedJSObject.insertTableItemFast(this.insertTable, parameters);
			},
			
			insertTableItem: function (workspace, parameters) {
				return workspace.insertTableItem(this.insertTable, parameters);
			},
			
			insertTableItemAsynchronouslyFast: function (workspace, parameters, completionHandler) {
				return workspace.wrappedJSObject.insertTableItemAsynchronouslyFast(this.insertTable, parameters, completionHandler);
			},
			
			insertTableItemAsynchronously: function (workspace, parameters, completionHandler) {
				return workspace.insertTableItemAsynchronously(this.insertTable, parameters, completionHandler);
			},
			
			recordTableItemFast: function (workspace, parameters) {
				let _ROWID_ = this.insertTableItemFast(workspace, parameters);
				
				this.observerService.notifyObservers(workspace, this.recordNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			recordTableItem: function (workspace, parameters) {
				let _ROWID_ = this.insertTableItem(workspace, parameters);
				
				this.observerService.notifyObservers(workspace, this.recordNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			recordTableItemAsynchronouslyFast: function (workspace, parameters, completionHandler) {
				let self = this;
				
				return this.insertTableItemAsynchronouslyFast(workspace, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.recordNotification, rowId);
					
					if (completionHandler) {
						completionHandler(rowId, workspace);
					}
				});
			},
			
			recordTableItemAsynchronously: function (workspace, parameters, completionHandler) {
				let self = this;
				
				return this.insertTableItemAsynchronously(workspace, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.recordNotification, rowId);
					
					if (completionHandler) {
						completionHandler.handle(rowId, workspace);
					}
				});
			},
			
			updateTableItemFast: function (workspace, parameters) {
				let _ROWID_ = workspace.wrappedJSObject.updateTableItemFast(this.updateTable, parameters);
				
				this.observerService.notifyObservers(workspace, this.updateNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			updateTableItem: function (workspace, parameters) {
				let _ROWID_ = workspace.updateTableItem(this.updateTable, parameters);
				
				this.observerService.notifyObservers(workspace, this.updateNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			updateTableItemAsynchronouslyFast: function (workspace, parameters, completionHandler) {
				let self = this;
				
				return workspace.wrappedJSObject.updateTableItemAsynchronouslyFast(this.updateTable, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.updateNotification, rowId);
					
					if (completionHandler) {
						completionHandler(rowId, workspace);
					}
				});
			},
			
			updateTableItemAsynchronously: function (workspace, parameters, completionHandler) {
				let self = this;
				
				return workspace.updateTableItemAsynchronously(this.updateTable, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.updateNotification, rowId);
					
					if (completionHandler) {
						completionHandler.handle(rowId, workspace);
					}
				});
			},
			
			deleteTableItemFast: function (workspace, parameters) {
				let _ROWID_ = workspace.wrappedJSObject.deleteTableItemFast(this.deleteTable, parameters);
				
				this.observerService.notifyObservers(workspace, this.deleteNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			deleteTableItem: function (workspace, parameters) {
				let _ROWID_ = workspace.deleteTableItem(this.deleteTable, parameters);
				
				this.observerService.notifyObservers(workspace, this.deleteNotification, _ROWID_);
				
				return _ROWID_;
			},
			
			deleteTableItemAsynchronouslyFast: function (workspace, parameters, completionHandler) {
				let self = this;
				
				return workspace.wrappedJSObject.deleteTableItemAsynchronouslyFast(this.deleteTable, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.deleteNotification, rowId);
					
					if (completionHandler) {
						completionHandler(rowId, workspace);
					}
				});
			},
			
			deleteTableItemAsynchronously: function (workspace, parameters, completionHandler) {
				let self = this;
				
				return workspace.deleteTableItemAsynchronously(this.deleteTable, parameters, function (rowId, workspace) {
					self.observerService.notifyObservers(workspace, self.deleteNotification, rowId);
					
					if (completionHandler) {
						completionHandler.handle(rowId, workspace);
					}
				});
			},
			
			enumerateTableItemsFast: function (workspace, parameters) {
				return workspace.wrappedJSObject.enumerateTableItems(this.enumerateTable, parameters);
			},
			
			enumerateTableItems: function (workspace, parameters) {
				return workspace.enumerateTableItems(this.enumerateTable, parameters);
			},
			
			enumerateTableItemsAsynchronouslyFast: function (workspace, parameters, resultHandler, completionHandler) {
				return workspace.wrappedJSObject.enumerateTableItemsAsynchronouslyFast(this.enumerateTable, parameters, resultHandler, completionHandler);
			},
			
			enumerateTableItemsAsynchronously: function (workspace, parameters, resultHandler, completionHandler) {
				return workspace.enumerateTableItemsAsynchronously(this.enumerateTable, parameters, resultHandler, completionHandler);
			}
		};
		
		tableAPI.wrappedJSObject = tableAPI;
		
		return tableAPI;
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryWorkspacesService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/