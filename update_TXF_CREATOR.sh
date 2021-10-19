#!/usr/bin/env bash

TXF_CREATOR=${1:-GA7TZL6MJIWRQO5EKOX4XSP4EEQN6BCOW6XHU4UCYHOA67PN3V5RMASS}
FILE='../stellar-smart-contracts/.env.dist'
UPDATE='TXF_CREATOR = <Stellar public key>'
echo "- updating '${UPDATE}' in ${FILE} with:"
echo "  ${UPDATE} # ${TXF_CREATOR}"

cat ${FILE} | sed -e "s/${UPDATE}/${UPDATE} # ${TXF_CREATOR}/g" > ${FILE}.updated
#mv ${FILE}.updated ${FILE}
