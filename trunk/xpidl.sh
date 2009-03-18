#!/bin/sh
PATH_TO_XPIDL_BIN="/opt/xulrunner-1.9-sdk/bin/xpidl"
PATH_TO_IDL_DIR="/opt/xulrunner-1.9-sdk/idl/"
$PATH_TO_XPIDL_BIN -m typelib -w -v -I $PATH_TO_IDL_DIR $@
