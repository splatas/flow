#!/usr/bin/bash

apk add curl xz py-docutils
PREVIOUS=$(curl -s https://web.flow.com.ar/api/v1/revision | sed 's/"//g;s/_.*//')

echo release $PREVIOUS $CI_COMMIT_REF_NAME
npm run release $PREVIOUS $CI_COMMIT_REF_NAME

curl -H 'Content-Type: application/json' \
  -d '{ "branch": "'$CI_COMMIT_REF_NAME'", "nodeEnv": "'$NODE_ENV'", "project": "'$CI_PROJECT_NAME'", "file": "'$(base64 release/$CI_PROJECT_NAME-$CI_COMMIT_REF_NAME.html.xz|tr -d \\n)'" }'
  https://gw-ff-dev.cablevisionflow.com.ar/hermes/supEmail \
