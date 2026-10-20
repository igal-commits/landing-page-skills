#!/bin/sh
# usage: PUPPETEER_FROM=<dir with node_modules/puppeteer-core> ./run-captures.sh <outRoot> <plan name>...
# Each plan name is a file in plans/ without the .json extension.
set -eu
OUT=$1; shift
HERE="$(cd "$(dirname "$0")" && pwd)"
for p in "$@"; do
  node "$HERE/capture.mjs" "$HERE/plans/$p.json" "$OUT/$p" | tail -1
done
