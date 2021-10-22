#!/usr/bin/env bash
#       ....:....|....:....|....:....|....:....|....:....|....:. 56 {{{1
GK=${1:-USER}
GV=${2:-GCVL2ZLW2FGVHZDV3EB5TFSXPGRWVVV5W3FB3JLLQTENAKBBFQDZJAHD}
SK=${3:-USER_SECRET}
SV=${4:-SBB4JSR6T77SF32EHPSK5QSEFWDHXBWAX5PS44F5UILLLWMZSFSZ2EPM}

SSC=${5:-../stellar-smart-contracts}

. $SSC/lib/update.sh

# Make sure the $GK and $SK lines is absent in ./.env, and {{{1
# have no default values in ./.env.dist.template
if [ $(line-count ./.env $GK) -gt 0 \
  -o $(line-count ./.env $SK) -gt 0 ]
then 
  echo "Found $GK or $SK line in ./.env,"
  echo 'skipping ./.env.dist update'
elif [ $(item-count ./.env.dist.template $GK '\# G') -gt 0 \
  -o $(item-count ./.env.dist.template $SK '\# S') -gt 0 ]
then
  echo "The $GK or $SK line in ./.env.dist.template has default value,"
  echo 'skipping ./.env.dist update'
else
  update-dist $GK $GV $SK $SV
  envdist
  export $(cat .env|tr -d [:blank:]|xargs)
  envsubst < ./config.mjs.dist > ./config.mjs
fi

