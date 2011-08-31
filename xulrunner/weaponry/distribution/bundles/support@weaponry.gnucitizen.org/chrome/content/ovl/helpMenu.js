/**
 *  helpMenu.js
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

function handleWeaponrySupportHelpMenuOpenHelpWindowCommandEvent(event) {
	weaponryCommon.openUriExternally('http://code.google.com/p/weaponry/w/list');
}

function handleWeaponrySupportHelpMenuReportBugsCommandEvent(event) {
	weaponryCommon.openUriExternally('http://code.google.com/p/weaponry/issues/list');
}

function handleWeaponrySupportHelpMenuRequestFeaturesCommandEvent(event) {
	weaponryCommon.openUriExternally('http://code.google.com/p/weaponry/issues/detail?id=2');
}

function handleWeaponrySupportHelpMenuGotoWeaponryCommandEvent(event) {
	weaponryCommon.openUriExternally('http://weaponry.gnucitizen.org');
}

function handleWeaponrySupportHelpMenuGotoGNUCITIZENCommandEvent(event) {
	weaponryCommon.openUriExternally('http://www.gnucitizen.com');
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/