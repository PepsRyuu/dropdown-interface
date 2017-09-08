#!/usr/bin/env bash

# If error code, stop script
set -e

# Install packages
npm config set strict-ssl false
npm install

# Test
npm run test -- --console --once

if [ "$#" -ne 0 ] && [ $1 = "--release" ]
then
    # Increment package json
    npm version $2 -m "Released %s"
    npm publish
    git push --follow-tags
fi