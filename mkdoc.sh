#!/bin/bash

cd "$(dirname -- "${BASH_SOURCE-$0}")"

rm -rf apidoc
jsdoc -P package.json -r -d apidoc -t /usr/lib/node_modules/jsdoc-baseline bleh.js lib
