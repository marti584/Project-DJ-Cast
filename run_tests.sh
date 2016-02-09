#!/bin/sh
npm install -g velocity-cli
cd tests/cucumber
npm install
cd ../..
CUCUMBER=0 JASMINE_BROWSER=PhantomJS velocity test-app --ci 
jasmine=$?
JASMINE_CLIENT_INTEGRATION=0 JASMINE_SERVER_INTEGRATION=0 SELENIUM_BROWSER=phantomjs velocity test-app --ci
cuke=$?
if [ $jasmine -ne 0 -o $cuke -ne 0 ]
then
  exit -1
fi
