/**
 *  extension.js
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

// browser preferences
pref('browser.chromeURL', 'chrome://browser.weaponry.gnucitizen.org/content/xul/browserView.xul');
pref('browser.hiddenWindowChromeURL', 'chrome://browser.weaponry.gnucitizen.org/content/xul/hiddenWindow.xul');

// app update preferences
//pref('app.update.url', 'https://weaponry.appspot.com/update/app.xml?product=%PRODUCT%&version=%VERSION%&build_id=%BUILD_ID%&build_target=%BUILD_TARGET%&locale=%LOCALE%&channel=%CHANNEL%&os_version=%OS_VERSION%&distribution=%DISTRIBUTION%&distribution_version=%DISTRIBUTION_VERSION%');
pref('app.update.url.manual', 'http://weaponry.gnucitizen.com');
pref('app.update.url.details', 'http://weaponry.gnucitizen.com');

// extensions update preferences
//pref('extensions.update.url', 'https://weaponry.appspot.com/update/ext.xml?req_version=%REQ_VERSION%&item_id=%ITEM_ID%&item_version=%ITEM_VERSION%&item_maxappversion=%ITEM_MAXAPPVERSION%&item_status=%ITEM_STATUS%&app_id=%APP_ID%&app_version=%APP_VERSION%&app_os=%APP_OS%&app_abi=%APP_ABI%&app_locale=%APP_LOCALE%&current_app_version=%CURRENT_APP_VERSION%&update_type=%UPDATE_TYPE%');
pref('extensions.update.url.manual', 'http://weaponry.gnucitizen.org');
pref('extensions.update.url.details', 'http://weaponry.gnucitizen.org');

// weaponry security CertOverrideService preferences
pref('org.gnucitizen.weaponry.security.CertOverrideService.exceptions.add.3', 'weaponry.appspot.com:443');
pref('org.gnucitizen.weaponry.security.CertOverrideService.exceptions.add.4', 'www.google.com:443');

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/