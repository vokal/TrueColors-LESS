#!/bin/bash

npm run testcover

RESULT=$?

if [ $RESULT == 0 ]; then
  echo "publish coverage for $TRAVIS_COMMIT"
  curl -F coverage=@coverage/lcov.info "https://cvr.vokal.io/coverage?owner=$REPO_OWNER&repo=$REPO_NAME&commit=$TRAVIS_COMMIT&coveragetype=lcov"
else
  curl -X POST "https://cvr.vokal.io/coverage/abort?owner=$REPO_OWNER&repo=$REPO_NAME&commit=$GITHASH"
fi

exit $RESULT
