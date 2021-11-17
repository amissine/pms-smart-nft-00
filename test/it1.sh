#!/usr/bin/env bash

echo "- starting $0 in $PWD..."; echo

# Start the server
npx ttab -w -d $PWD exec npm run www
