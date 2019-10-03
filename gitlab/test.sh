#!/bin/sh

echo NODE_ENV $NODE_ENV
npm i
CACHE_REDIS=no npm t
