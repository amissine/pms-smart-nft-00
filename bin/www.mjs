#!/usr/bin/env node

// See also: {{{1
// https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm

import express from 'express'
import bodyParser from 'body-parser'
import signedFeeXDR from '../src/index.mjs'

const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/', urlencodedParser, async (req, res) => { // {{{1
  console.log(`- fee ${req.body.fee}
  from : ${process.env.TXF_CREATOR}
  to   : ${process.env.TXF_AGENT}`)

  await signedFeeXDR(req.body.fee)
  .then(v => res.send(`${process.env.TXF_CREATOR}${v}`))
  .catch(e => console.error(e));
})

const server = app.listen(6000, () => { // {{{1
  let sa = server.address()
  console.log('- listening at http://%s:%s', sa.address, sa.port)
})
