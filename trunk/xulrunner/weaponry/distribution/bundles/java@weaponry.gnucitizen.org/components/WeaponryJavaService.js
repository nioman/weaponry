/**
 *  WeaponryJavaService.js
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

const CHROMEBASE = 'org.gnucitizen.weaponry.java';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
Components.utils.import('resource://org.gnucitizen.weaponry.common/content/mod/weaponryCommon.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryJavaService() {
	this.javaInterpreter = null;
	this.classPaths = [];
}

WeaponryJavaService.prototype = {
	classDescription: 'Weaponry Java Service',
	classID: Components.ID('{7eb32c10-99c6-11df-981c-0800200c9a66}'),
	contractID: '@java.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryJavaService]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	findJavaInterpeter: function () {
		switch (weaponryCommon.xulAppInfo.OS) {
			case 'Darwin':
				// TODO: take into consideration JAVAHOME and PATH environment variables
				
				let file = weaponryCommon.createInstance('@mozilla.org/file/local;1', 'nsILocalFile');
				
				file.initWithPath('/usr/bin/java');
				
				return file;
			case 'Linux':
				throw new Error('not implemented'); // TODO: add code here
			case 'WINNT':
				throw new Error('not implemented'); // TODO: add code here
			default:
				throw new Error('cannot find java interpreter');
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	getJavaInterpreter: function () {
		if (this.javaInterpreter == null) {
			this.javaInterpreter = this.findJavaInterpeter();
		}
		
		return this.javaInterpreter;
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareArguments: function (javaInterpreter, file, parameters) {
		let args = [javaInterpreter];
		
		if (this.classPaths.length > 0) {
			args.push('-cp');
			
			let classPaths = this.classPaths;
			let length = classPaths.length;
			let paths = [];
			
			let i;
			
			for (i = 0; i < length; i += 1) {
				paths.push(classPaths[i].path);
			}
			
			let pathSeparator = weaponryCommon.getPathSeparator();
			
			args.push(paths.join(pathSeparator));
		}
		
		// TODO: setup proxy settings
		// -Dhttp.proxyHost=proxyhostURL
		// -Dhttp.proxyPort=proxyPortNumber
		// -Dhttp.proxyUser=someUserName
		// -Dhttp.proxyPassword=somePassword
		//
		
		args.push(file);
		
		if (parameters) {
			return args.concat(parameters);
		} else {
			return args;
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	executeJavaFile: function (file, parameters) {
		weaponryCommon.executeFile.apply(weaponryCommon, this.prepareArguments(this.getJavaInterpeter(), file, parameters));
	},
	
	launchJavaFile: function (file, parameters) {
		weaponryCommon.launchFile.apply(weaponryCommon, this.prepareArguments(this.getJavaInterpeter(), file, parameters));
	},
	
	/* -------------------------------------------------------------------- */
	
	addClassPath: function (classPath) {
		this.classPaths.push(classPath);
	},
	
	removeClassPath: function (classPath) {
		let path = classPath.path;
		let classPaths = this.classPaths;
		let length = classPaths.length;
		let newClassPaths = [];
		
		let i;
		
		for (i = 0; i < length; i += 1) {
			if (classPaths[i].path != path) {
				newClassPaths.push(classPaths);
			}
		}
		
		this.classPaths = newClassPaths;
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryJavaService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/