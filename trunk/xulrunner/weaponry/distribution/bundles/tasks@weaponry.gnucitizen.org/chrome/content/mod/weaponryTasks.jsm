/**
 *  weaponryTasks.jsm
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

let EXPORTED_SYMBOLS = ['weaponryTasks'];

/* ------------------------------------------------------------------------ */

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

const CHROMEBASE = 'tasks.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');

/* ------------------------------------------------------------------------ */

let weaponryTasks = new function () {
	let weaponryTasks = this;
	
	/* -------------------------------------------------------------------- */
	
	this.tasksManager = weaponryCommon.getService('@tasks.weaponry.gnucitizen.org/manager;1', 'IWeaponryTasksManager');
	this.tasksService = weaponryCommon.getService('@tasks.weaponry.gnucitizen.org/service;1', 'IWeaponryTasksService');
	
	/* -------------------------------------------------------------------- */
	
	this.createTaskWithPrototype = function (prototype) {
		return this.tasksService.createTaskWithPrototype(prototype);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.destroyTask = function (name) {
		return this.tasksService.destroyTask(name);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getTask = function (name) {
		try {
			return this.tasksService.getTask(name);
		} catch (e) {
			Components.utils.reportError(e);
			
			return null;
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.setupTask = function (name, options) {
		return this.tasksService.setupTask(name, JSON.stringify(options));
	};
	
	this.actTask = function (name) {
		return this.tasksService.actTask(name);
	};
	
	this.startTask = function (name) {
		return this.tasksService.startTask(name);
	};
	
	this.stopTask = function (name) {
		return this.tasksService.stopTask(name);
	};
	
	this.pauseTask = function (name) {
		return this.tasksService.pauseTask(name);
	};
	
	this.resumeTask = function (name) {
		return this.tasksService.resumeTask(name);
	};
	
	this.finishTask = function (name) {
		return this.tasksService.finishTask(name);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.enumerateTasks = function (handler, completionHandler) {
		let tasks = [];
		let enumerator = this.tasksService.enumerateTasks();
		
		while (enumerator.hasMoreElements()) {
			let task = enumerator.getNext().QueryInterface(CI.IWeaponryTask);
			
			if (handler) {
				handler(task);
			}
			
			tasks.push(task);
		}
		
		if (completionHandler) {
			completionHandler(tasks);
		}
		
		return tasks;
	};
	
	this.enumerateTasksAsynchronously = function (handler, completionHandler) {
		return this.tasksService.enumerateTasksAsynchronously(handler, completionHandler);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.openTasksWindow = function () {
		return this.tasksService.openTasksWindow();
	};
	
	/* -------------------------------------------------------------------- */
	
	this.createTaskProcessLauncher = function (window, type) {
		let launcher = {
			setup: function (options) {
				let processWindow = weaponryCommon.openWindow(window, 'chrome://' + CHROMEBASE + '/content/xul/taskProcess.xul?process=' + type, '', 'chrome,titlebar=no,popup=yes');
				
				processWindow.addEventListener('load', function (event) {
					if (event.target != processWindow.document) {
						return;
					}
					
					processWindow.removeEventListener('load', arguments.callee, false);
					
					processWindow.isSetuped = true;
					
					processWindow.setup(options);
				}, false);
				
				this.processWindow = processWindow;
			},
			
			start: function () {
				if (!this.processWindow) {
					throw new Error('process was destroyed');
				}
				
				if ('isSetuped' in this.processWindow && this.processWindow.isSetuped == true) {
					this.processWindow.start();
				} else {
					let self = this;
					
					this.processWindow.addEventListener('load', function (event) {
						if (event.target != self.processWindow.document) {
							return;
						}
						
						self.processWindow.removeEventListener('load', arguments.callee, false);
						
						self.processWindow.start();
					}, false);
				}
			},
			
			stop: function () {
				if (!this.processWindow) {
					throw new Error('process was destroyed');
				}
				
				if ('isSetuped' in this.processWindow && this.processWindow.isSetuped == true) {
					this.processWindow.stop();
				} else {
					let self = this;
					
					this.processWindow.addEventListener('load', function (event) {
						if (event.target != self.processWindow.document) {
							return;
						}
						
						self.processWindow.removeEventListener('load', arguments.callee, false);
						
						self.processWindow.stop();
					}, false);
				}
			},
			
			pause: function () {
				if (!this.processWindow) {
					throw new Error('process was destroyed');
				}
				
				if ('isSetuped' in this.processWindow && this.processWindow.isSetuped == true) {
					this.processWindow.pause();
				} else {
					let self = this;
					
					this.processWindow.addEventListener('load', function (event) {
						if (event.target != self.processWindow.document) {
							return;
						}
						
						self.processWindow.removeEventListener('load', arguments.callee, false);
						
						self.processWindow.pause();
					}, false);
				}
			},
			
			resume: function () {
				if (!this.processWindow) {
					throw new Error('process was destroyed');
				}
				
				if ('isSetuped' in this.processWindow && this.processWindow.isSetuped == true) {
					this.processWindow.resume();
				} else {
					let self = this;
					
					this.processWindow.addEventListener('load', function (event) {
						if (event.target != self.processWindow.document) {
							return;
						}
						
						self.processWindow.removeEventListener('load', arguments.callee, false);
						
						self.processWindow.resume();
					}, false);
				}
			}
		};
		
		return launcher;
	};
};

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/