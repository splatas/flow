#!/bin/sh

cp /root/extrakeys/nodejs_id_rsa* ..

echo DEPLOY_TOKEN $DEPLOY_TOKEN
echo DEPLOY_TESTS=no DEPLOY_BRANCH=$CI_COMMIT_REF_NAME npx shipit $NODE_ENV deploy

sed -ri $'s/repositoryUrl: \`git@([a-zA-Z0-9\.]+):/repositoryUrl:\`http:\\/\\/'$DEPLOY_TOKEN$'@\\1\\//' shipitfile.js
grep repositoryUrl shipitfile.js


apk add openssh
npm i shipit-cli shipit-deploy
DEPLOY_TESTS=no DEPLOY_BRANCH=$CI_COMMIT_REF_NAME npx shipit $NODE_ENV deploy
