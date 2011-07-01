/**
 *  WeaponryTask.js
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

const CHROMEBASE = 'tasks.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryTask() {
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
	this.taskPrototype = null;
	this.id = 'task-' + (new Date()).getTime() + Math.random().toString().substring(2);
	this.state = 'instantiated';
}

WeaponryTask.prototype = {
	classDescription: 'Weaponry Task',
	classID: Components.ID('{62707dc0-0531-11df-8a39-0800200c9a66}'),
	contractID: '@tasks.weaponry.gnucitizen.org/task;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryTask]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	initWithPrototype: function (prototype) {
		this.initWithPrototype = function () {
			// pass
		};
		
		this.create();
		
		this.taskPrototype = prototype;
		
		if (this.taskPrototype instanceof CI.IWeaponryTaskHolder) {
			this.taskPrototype.setTask(this);
		}
		
		this.observerService.notifyObservers(this, 'weaponry-task-initialized', null);
	},
	
	/* -------------------------------------------------------------------- */
	
	create: function () {
		this.create = function () {
			// pass
		};
		
		this.observerService.notifyObservers(this, 'weaponry-task-to-be-created', null);
		
		this.state = 'created';
		
		this.observerService.notifyObservers(this, 'weaponry-task-created', null);
	},
	
	destroy: function () {
		this.destroy = function () {
			// pass
		};
		
		this.observerService.notifyObservers(this, 'weaponry-task-to-be-destroyed', null);
		
		if (!(this.state in {'stopped':1, 'finished':1}) && this.isStoppable) {
			this.stop();
		}
		
		this.state = 'destroyed';
		
		this.update = function () {
			// pass
		};
		
		this.setup = function () {
			// pass
		};
		
		this.act = function () {
			// pass
		};
		
		this.start = function () {
			// pass
		};
		
		this.stop = function () {
			// pass
		};
		
		this.pause = function () {
			// pass
		};
		
		this.resume = function () {
			// pass
		};
		
		this.finish = function () {
			// pass
		};
		
		if (this.taskPrototype instanceof CI.IWeaponryTaskHolder) {
			this.taskPrototype.unsetTask(this);
		}
		
		this.observerService.notifyObservers(this, 'weaponry-task-destroyed', null);
	},
	
	/* -------------------------------------------------------------------- */
	
	get name () {
		return this.id;
	},
	
	get type () {
		return this.taskPrototype.type;
	},
	
	get title () {
		return this.taskPrototype.title;
	},
	
	get status () {
		return this.taskPrototype.status;
	},
	
	get progress () {
		return this.taskPrototype.progress;
	},
	
	get thumbnailUri () {
		return this.taskPrototype.thumbnailUri;
	},
	
	/* -------------------------------------------------------------------- */
	
	get isActable () {
		return this.taskPrototype.isActable ? true: false;
	},
	
	get isStoppable () {
		return this.taskPrototype.isStoppable ? true : false;
	},
	
	get isPausable () {
		return this.taskPrototype.isPausable ? true : false;
	},
	
	get isAutodestroyable () {
		return this.taskPrototype.isAutodestroyable ? true : false;
	},
	
	get isInstantiated () {
		return this.state == 'instantiated' ? true : false;
	},
	
	get isCreated () {
		return this.state == 'created' ? true : false;
	},
	
	get isRunning () {
		return this.state == 'running' ? true : false;
	},
	
	get isStopped () {
		return this.state == 'stopped' ? true : false;
	},
	
	get isPaused () {
		return this.state == 'paused' ? true : false;
	},
	
	get isFinished () {
		return this.state == 'finished' ? true : false;
	},
	
	get isDestroyed () {
		return this.state == 'destroyed' ? true : false;
	},
	
	/* -------------------------------------------------------------------- */
	
	sameAs: function (task) {
		return this.id == task.id;
	},
	
	/* -------------------------------------------------------------------- */
	
	update: function () {
		this.observerService.notifyObservers(this, 'weaponry-task-updated', null);
	},
	
	setup: function (options) {
		this.taskPrototype.setup(options);
		
		this.observerService.notifyObservers(this, 'weaponry-task-setuped', null);
	},
	
	act: function () {
		if (!this.isActable) {
			throw new Error('task is not actable');
		}
		
		this.taskPrototype.act();
		
		this.observerService.notifyObservers(this, 'weaponry-task-acted', null);
	},
	
	start: function () {
		if (this.state != 'created') {
			throw new Error('task was not created');
		}
		
		this.start = function () {
			// pass
		};
		
		this.taskPrototype.start();
		
		this.state = 'running';
		
		this.observerService.notifyObservers(this, 'weaponry-task-started', null);
		
		this.update();
	},
	
	stop: function () {
		if (this.state == 'instantiated') {
			throw new Error('task was instantiated but not created');
		}
		
		if (this.state == 'created') {
			throw new Error('task was created but not started');
		}
		
		if (!this.isStoppable) {
			throw new Error('task is not stoppable');
		}
		
		this.stop = function () {
			// pass
		};
		
		this.taskPrototype.stop();
		
		this.state = 'stopped';
		
		this.observerService.notifyObservers(this, 'weaponry-task-stopped', null);
		
		this.update();
		
		if (this.isAutodestroyable) {
			this.destroy();
		}
	},
	
	pause: function () {
		if (this.state != 'running') {
			throw new Error('task is not running');
		}
		
		if (!this.isPausable) {
			throw new Error('taks is not pausable');
		}
		
		this.taskPrototype.pause();
		
		this.state = 'paused';
		
		this.observerService.notifyObservers(this, 'weaponry-task-paused', null);
		
		this.update();
	},
	
	resume: function () {
		if (this.state != 'paused') {
			throw new Error('task is not paused');
		}
		
		if (!this.isPausable) {
			throw new Error('taks is not pausable');
		}
		
		this.taskPrototype.resume();
		
		this.state = 'running';
		
		this.observerService.notifyObservers(this, 'weaponry-task-resumed', null);
		
		this.update();
	},
	
	finish: function () {
		this.finish = function () {
			// pass
		};
		
		if (this.taskPrototype.progress < 0) {
			this.__defineGetter__('progress', function () {
				return 100;
			});
		}
		
		this.state = 'finished';
		
		this.observerService.notifyObservers(this, 'weaponry-task-finished', null);
		
		this.update();
		
		if (this.isAutodestroyable) {
			this.destroy();
		}
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryTask]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/