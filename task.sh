#!/usr/bin/env bash

cwd=$(pwd)
dir=$(dirname "$0")
# echo $cwd
node "$dir/task.js" "$cwd" "$@"
