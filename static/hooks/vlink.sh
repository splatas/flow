#!/bin/bash


# CWD="$(pwd)"
# echo $CWD
cd .git/hooks
ln -s ../../static/hooks/commit-msg commit-msg
chmod u+x ../../static/hooks/commit-msg