#!/usr/bin/env bash
#              ....:....|....:....|....:....|....:....|....:....|....:. 56 {{{1
TXF_AGENT=${1:-GCCWIGGQY4XJKRPJUC6X7ITQMICNBIENUUTFZCYRU7BIRDKPHIGMJOL3}
TXF_AGENT_SECRET=${2:-SDNVWY2WLSAXAOG6IWIC56B74ZS6OBJVRHPB5FY4ID7NKUZHSGBNFJO7}

. ../stellar-smart-contracts/lib/update.sh

# Validate the args {{{1
if [ ${#TXF_AGENT} -ne 56 -o ${#TXF_AGENT_SECRET} -ne 56 \
  -o "${TXF_AGENT:0:1}" != "G" -o "${TXF_AGENT_SECRET:0:1}" != "S" ]
then
  echo 'Invalid args:'
  echo "- TXF_AGENT        = $TXF_AGENT"
  echo "- TXF_AGENT_SECRET = $TXF_AGENT_SECRET"
  exit 1
fi

# Make sure the TXF_AGENT and TXF_AGENT_SECRET lines is absent in ./.env, and {{{1
# have no default values in ./.env.dist.template
if [ $(line-count ./.env TXF_AGENT) -gt 0 \
  -o $(line-count ./.env TXF_AGENT_SECRET) -gt 0 ]
then 
  echo 'Found TXF_AGENT or TXF_AGENT_SECRET line in ./.env,'
  echo 'skipping ./.env.dist update'
elif [ $(item-count ./.env.dist.template TXF_AGENT '\# G') -gt 0 \
  -o $(item-count ./.env.dist.template TXF_AGENT_SECRET '\# S') -gt 0 ]
then
  echo 'The TXF_AGENT or TXF_AGENT_SECRET line in ./.env.dist.template has default value,'
  echo 'skipping ./.env.dist update'
else
  update-local TXF_AGENT $TXF_AGENT TXF_AGENT_SECRET $TXF_AGENT_SECRET
  npx envdist

  # Export all variables from .env to the current process env. {{{2
  export $(cat .env|tr -d [:blank:]|xargs)

  # Generate wrangler.toml from wrangler.toml.dist and the current process env. {{{2
  envsubst < ./wrangler.toml.dist > ./wrangler.toml
fi

# Make sure the TXF_AGENT line is absent in ../stellar-smart-contracts/.env, and {{{1
# the TXF_AGENT line in ../stellar-smart-contracts/.env.dist.template has no default value
if [ $(line-count ../stellar-smart-contracts/.env TXF_AGENT) -gt 0 ]
then
  echo
  echo 'Found TXF_AGENT line in ../stellar-smart-contracts/.env,'
  echo 'skipping ../stellar-smart-contracts/.env.dist.template update'
elif [ $(item-count ../stellar-smart-contracts/.env.dist.template TXF_AGENT '\# G') -gt 0 ]
then
  echo
  echo 'The TXF_AGENT line in ../stellar-smart-contracts/.env.dist.template has default value,'
  echo 'skipping ../stellar-smart-contracts/.env.dist.template update'
else
  update-stellar-smart-contracts TXF_AGENT $TXF_AGENT
fi

