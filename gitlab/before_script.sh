#!/bin/sh

if [ "$NODE_ENV" == "" ]
  then NODE_ENV=$CI_COMMIT_REF_NAME
fi

if [ "$NODE_ENV" == "develop" -o "$NODE_ENV" == "prod" ]
  then echo "nice im at ${NODE_ENV}!"
  else if [ "$NODE_ENV" == "master" ]
  then
    NODE_ENV=staging
  else
    NODE_ENV=preprod
  fi
fi

CIPROJNAME=$CI_PROJECT_NAME
if [ "$CIPROJNAME" == "api_gateway" ]
  then CIPROJNAME="api-gateway"
fi

apk add git
git checkout $CI_COMMIT_REF_NAME
if [ "$CI_COMMIT_REF_NAME" == "develop" -o "$CI_COMMIT_REF_NAME" == "master" ]
  then git pull
fi
