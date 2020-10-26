#!/usr/bin/env node
const fetch = require('node-fetch')
const variables = require('../config/variables')
const env = variables.enviroment || 'local'

const RANNI_URL = 'http://10.200.172.71/ranni/v1/public/jwt.json'

const fixtures = {
  prod: {
    api: 'https://web.flow.com.ar/auth/v2',
    minerva: 'http://geo.mnedge.cvattv.com.ar:7780/xtv-ws-client/api',
  },
  preprod: {
    api: 'https://web-prepro.flow.com.ar/auth/v2',
    minerva: 'http://geo.mnedge.prepro.cvattv.com.ar:7780/xtv-ws-client/api',
  },
  staging: {
    api: 'https://web-ff-stg.cablevisionflow.com.ar/auth/v2',
    minerva: 'http://geo.mnedge.cvattv.com.ar:7780/xtv-ws-client/api',
  },
  develop: {
    api: 'https://gw-ff-dev.cablevisionflow.com.ar/auth/v2',
    minerva: 'http://geo.mnedge.cvattv.com.ar:7780/xtv-ws-client/api',
  }
}

fixtures.local = JSON.parse(JSON.stringify(fixtures.develop))

const getJwt = async () => {
  try {
    const response = await fetch(RANNI_URL, { method: 'GET' })
    if (response.status !== 200) throw new Error('JWT fetch did not succeed')
    const body = await response.json()
    return body
  } catch (e) {
    console.error(e)
  }
}

getJwt().then((jwt) => {
  const { jwt: token, accountId } = jwt[env] ? jwt[env] : jwt.preprod // Fallback to preprod
  fixtures[env].token = 'Bearer ' + token
  fixtures[env].accountId = accountId
}).catch(e => {
  console.error(e)
  process.exit(1)
})
