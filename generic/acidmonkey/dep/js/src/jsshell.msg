/* -*- Mode: C; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 *
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Communicator client code, released
 * March 31, 1998.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
	Error messages for JSShell. See js.msg for format.
*/

MSG_DEF(JSSMSG_NOT_AN_ERROR,             0, 0, JSEXN_NONE, "<Error #0 is reserved>")
MSG_DEF(JSSMSG_CANT_OPEN,                1, 2, JSEXN_NONE, "can't open {0}: {1}") 
MSG_DEF(JSSMSG_TRAP_USAGE,               2, 0, JSEXN_NONE, "usage: trap [fun] [pc] expr") 
MSG_DEF(JSSMSG_LINE2PC_USAGE,            3, 0, JSEXN_NONE, "usage: line2pc [fun] line") 
MSG_DEF(JSSMSG_FILE_SCRIPTS_ONLY,        4, 0, JSEXN_NONE, "only works on JS scripts read from files") 
MSG_DEF(JSSMSG_UNEXPECTED_EOF,           5, 1, JSEXN_NONE, "unexpected EOF in {0}") 
MSG_DEF(JSSMSG_DOEXP_USAGE,              6, 0, JSEXN_NONE, "usage: doexp obj id") 
MSG_DEF(JSSMSG_SCRIPTS_ONLY,             7, 0, JSEXN_NONE, "only works on scripts") 
MSG_DEF(JSSMSG_NOT_ENOUGH_ARGS,          8, 1, JSEXN_NONE, "{0}: not enough arguments")
MSG_DEF(JSSMSG_TOO_MANY_ARGS,            9, 1, JSEXN_NONE, "{0}: too many arguments")
MSG_DEF(JSSMSG_ASSERT_EQ_FAILED,        10, 2, JSEXN_NONE, "Assertion failed: got {0}, expected {1}")
MSG_DEF(JSSMSG_ASSERT_EQ_FAILED_MSG,    11, 3, JSEXN_NONE, "Assertion failed: got {0}, expected {1}: {2}")
MSG_DEF(JSSMSG_INVALID_ARGS,            12, 1, JSEXN_NONE, "{0}: invalid arguments")
MSG_DEF(JSSMSG_ASSERT_JIT_FAILED,       13, 0, JSEXN_NONE, "unexpected failure to JIT")

