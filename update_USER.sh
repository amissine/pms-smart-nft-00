#!/usr/bin/env bash
#         ....:....|....:....|....:....|....:....|....:....|....:. 56 {{{1
USER=${1:-GCVL2ZLW2FGVHZDV3EB5TFSXPGRWVVV5W3FB3JLLQTENAKBBFQDZJAHD}
USER_SECRET=${2:-SBB4JSR6T77SF32EHPSK5QSEFWDHXBWAX5PS44F5UILLLWMZSFSZ2EPM}

. ../stellar-smart-contracts/lib/update.sh

# Validate the args {{{1
if [ ${#USER} -ne 56 -o ${#USER_SECRET} -ne 56 \
  -o "${USER:0:1}" != "G" -o "${USER_SECRET:0:1}" != "S" ]
then
  echo 'Invalid args:'
  echo "- USER        = $USER"
  echo "- USER_SECRET = $USER_SECRET"
  exit 1
fi

# Make sure the USER and USER_SECRET lines is absent in ./.env, and {{{1
# have no default values in ./.env.dist.template
if [ $(line-count ./.env USER) -gt 0 \
  -o $(line-count ./.env USER_SECRET) -gt 0 ]
then 
  echo 'Found USER or USER_SECRET line in ./.env,'
  echo 'skipping ./.env.dist update'
elif [ $(item-count ./.env.dist.template USER '\# G') -gt 0 \
  -o $(item-count ./.env.dist.template USER_SECRET '\# S') -gt 0 ]
then
  echo 'The USER or USER_SECRET line in ./.env.dist.template has default value,'
  echo 'skipping ./.env.dist update'
else
  update-local USER $USER USER_SECRET $USER_SECRET
  npx envdist
fi
