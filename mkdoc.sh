#!/bin/bash

cd "$(dirname -- "${BASH_SOURCE-$0}")"

rm -rf apidoc &&
mkdir -p apidoc &&
asciidoc -b html -o apidoc/index.html doc/api/index.adoc
