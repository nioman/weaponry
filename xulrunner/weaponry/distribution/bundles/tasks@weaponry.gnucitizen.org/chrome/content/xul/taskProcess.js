/**
 *  taskProcess.js
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

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function doInit(options) {
	throw new Error('not implemented');
}

/* ------------------------------------------------------------------------ */

function doSetup(options) {
	throw new Error('not implemented');
}

/* ------------------------------------------------------------------------ */

function doAct() {
	throw new Error('not implemented');
}

/* ------------------------------------------------------------------------ */

function doStart() {
	throw new Error('not implemented');
}

function doStop() {
	throw new Error('not implemented');
}

/* ------------------------------------------------------------------------ */

function doPause() {
	throw new Error('not implemented');
}

function doResume() {
	throw new Error('not implemented');
}

/* ------------------------------------------------------------------------ */

window.taskPrototype = {
	QueryInterface: XPCOMUtils.generateQI([Components.interfaces.IWeaponryTaskPrototype]),
	
	/* -------------------------------------------------------------------- */
	
	type: 'weaponry-task-process',
	
	/* -------------------------------------------------------------------- */
	
	title: '',
	progress: -1,
	status: '',
	
	/* -------------------------------------------------------------------- */
	
	isActable: true,
	isStoppable: true,
	isPausable: true,
	
	/* -------------------------------------------------------------------- */
	
	setup: function (options) {
		doSetup(options);
	},
	
	/* -------------------------------------------------------------------- */
	
	act: function () {
		doAct();
	},
	
	/* -------------------------------------------------------------------- */
	
	start: function () {
		doStart();
	},
	
	stop: function () {
		doStop();
	},
	
	/* -------------------------------------------------------------------- */
	
	pause: function () {
		doPause();
	},
	
	resume: function () {
		doResume();
	},
};

/* ------------------------------------------------------------------------ */

function createTaskProcess() {
	return weaponryTasks.createTaskWithPrototype(window.taskPrototype);
}

/* ------------------------------------------------------------------------ */

function init(options) {
	window.taskProcess = createTaskProcess();
	
	doInit(options);
}

/* ------------------------------------------------------------------------ */

function setup(options) {
	init(options);
	
	window.taskProcess.setup(options);
}

/* ------------------------------------------------------------------------ */

function start() {
	start = function () {
		// pass
	};
	
	window.taskProcess.start();
}

function stop() {
	stop = function () {
		// pass
	};
	
	window.taskProcess.stop();
}

/* ------------------------------------------------------------------------ */

function pause() {
	window.taskProcess.pause();
}

function resume() {
	window.taskProcess.resume();
}

/* ------------------------------------------------------------------------ */

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.workspacesObserver = weaponryCommon.createObserver(['weaponry-task-destroyed'], function (subject, topic, data) {
		if (topic == 'weaponry-task-destroyed') {
			let task = subject.QueryInterface(CI.IWeaponryTask);
			
			if (window.taskProcess.sameAs(task)) {
				window.close();
			}
		}
	});
	
	window.workspacesObserver.register();
}

window.addEventListener('load', handleLoadEvent, false);

function handleUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.workspacesObserver.unregister();
	
	if (window.taskProcess) {
		window.taskProcess.destroy();
	}
}

window.addEventListener('unload', handleUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/