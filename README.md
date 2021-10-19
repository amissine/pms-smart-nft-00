# 👷 pms-smart-nft-00
Poor Man's Sandbox: drop 00 of Smart NFTs is code named “Escalated Royalties”.

## Sources:

- [Tyler's Drop 00](https://tyvdh.notion.site/Drop-00-Escalated-Royalties-7c06b709f5f94784aa4aae0bc178f366)

- [esbuild](https://esbuild.github.io/)

## Setup
Make sure `../stellar-smart-contracts/` exists, then

```bash
npm run init [ G... S... ]
```

## Update creator keys
To update `TXF_CREATOR` and `TXF_CREATOR_SECRET` in `./.env`, first make sure these lines are absent in the file, and have no default values (do not end with ` # ...`) in `./.env.dist.template`. Also, make sure that:

- the `TXF_CREATOR` line is absent in `../stellar-smart-contracts/.env`; and

- the `TXF_CREATOR` line in `../stellar-smart-contracts/.env.dist.template` has no default value (does not end with ` # G...`) and  looks exactly like this:

```
TXF_CREATOR = <Stellar public key>
```

, as the update will add the default value to it.

When this is done,

```bash
npm run update G... S...
```
## Update user keys
To update `TXF_CREATOR` and `TXF_CREATOR_SECRET` in `./.env`, first make sure these lines are absent in the file, and have no default values (do not end with ` # ...`) in `./.env.dist.template`. Also, make sure that:

- the `TXF_CREATOR` line is absent in `../stellar-smart-contracts/.env`; and

- the `TXF_CREATOR` line in `../stellar-smart-contracts/.env.dist.template` has no default value (does not end with ` # G...`) and  looks exactly like this:

```
TXF_CREATOR = <Stellar public key>
```

, as the update will add the default value to it. See also [Update creator keys](#update-creator-keys).

When this is done,

```bash
npm run update G... S...
```
