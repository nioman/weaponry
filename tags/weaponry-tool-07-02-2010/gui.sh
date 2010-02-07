#!/bin/sh

#
# ENABLE LOGGING
#
#export NSPR_LOG_MODULES=nsNativeModuleLoader:5
#export NSPR_LOG_FILE=`dirname $0`/nspr.log

#
# RUN APPLICATION
#
PATH_TO_XULRUNNER_BIN=`which xulrunner-1.9`
$PATH_TO_XULRUNNER_BIN `dirname $0`/application.ini $@
