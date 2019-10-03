#!/usr/bin/bash

echo node env $NODE_ENV
apk add curl
npm i

NODE_ENV=$NODE_ENV ./static/openapi.js > "${CIPROJNAME}_${NODE_ENV}".json

echo F '=@'"${CIPROJNAME}_${NODE_ENV}"'.json' https://10.254.244.112/swagger-shiva/v1/upload
unset https_proxy
curl -F '=@'"${CIPROJNAME}_${NODE_ENV}"'.json' -k https://10.254.244.112/swagger-shiva/v1/upload
curl -F '=@'"${CIPROJNAME}_${NODE_ENV}"'.json' -k https://10.254.244.113/swagger-shiva/v1/upload

if [ "$CI_COMMIT_REF_NAME" == "develop" -o "$CI_COMMIT_REF_NAME" == "master" ]
  then curl -H 'Content-Type: application/json' \
    -d '{ "branch": "'$CI_COMMIT_REF_NAME'", "nodeEnv": "'$NODE_ENV'", "project": "'$CI_PROJECT_NAME'" }' \
    https://gw-ff-dev.cablevisionflow.com.ar/hermes/notification
fi
