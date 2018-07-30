#!/bin/bash

echo 'module.exports = [' >colormap.js
for c256 in `seq 0 255`; do
	printf -- '--- %d ---\n' "$c256"
	for c16 in `seq 0 15`; do
		printf '\033[0m%02d\033[38;5;%dmXX\033[0m' "$c16" "$c16"
		printf '\033[0m\033[38;5;%dmXX\033[0m\n' "$c256"
	done
	echo -n '> '
	read m16
	printf '\t/* %d -> */ %d%s\n' "$c256" "$m16" "$(if [ "$c256" = 255 ]; then true; else echo ,; fi)" >>colormap.js
done
echo '];' >>colormap.js
