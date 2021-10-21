#!/usr/bin/env bash
#       ....:....|....:....|....:....|....:....|....:....|....:. 56 {{{1
GK=${1:-TXF_CREATOR}
GV=${2:-GA7TZL6MJIWRQO5EKOX4XSP4EEQN6BCOW6XHU4UCYHOA67PN3V5RMASS}
SK=${3:-TXF_CREATOR_SECRET}
SV=${4:-SB7KKMPNU6KTFOF73YJWKGAHG6BEPEGEAHPYFPRZHNKPKLDX7KG45NYJ}

SSC=${5:-../stellar-smart-contracts}

. $SSC/lib/update.sh

update-creator () {
  cd $1
  update-template $GK $2
  cd -
}

validate-args $GK $GV $SK $SV

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
  envsubst < ./wrangler.toml.dist > ./wrangler.toml
fi

# Make sure the $GK line is absent in $SSC/.env, and {{{1
# the $GK line in $SSC/.env.dist.template has no default value
if [ $(line-count $SSC/.env $GK) -gt 0 ]
then
  echo
  echo "Found $GK line in $SSC/.env,"
  echo "skipping $SSC/.env.dist.template update"
elif [ $(item-count $SSC/.env.dist.template $GK '\# G') -gt 0 ]
then
  echo
  echo "The $GK line in $SSC/.env.dist.template has default value,"
  echo "skipping $SSC/.env.dist.template update"
else
  update-creator $SSC/ $GV
fi

