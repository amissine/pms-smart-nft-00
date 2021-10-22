#!/usr/bin/env bash

# Export all variables from ./.env to the current process env. {{{1
export $(cat .env|tr -d [:blank:]|xargs)

# Generate config.mjs from config.mjs.dist and the current process env. {{{1
envsubst < ./config.mjs.dist > ./config.mjs
