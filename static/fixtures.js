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
  }
}

fixtures[env] = fixtures[env === 'preprod' ? 'preprod' : 'prod']

const getJwt = async () => {
  try {
    const response = await fetch(RANNI_URL, { method: 'GET' })
    if (response.status !== 200) throw new Error('JWT fetch did not succeed')
    return response.json()
  } catch (e) {
    console.error(e)
  }
}

getJwt().then((jwt) => {
  const { jwt: token, accountId } = jwt[env === 'preprod' ? 'preprod' : 'prod']
  fixtures[env].token = 'Bearer ' + token
  fixtures[env].accountId = accountId
  console.log(JSON.stringify(fixtures, null, 2))
}).catch(e => {
  console.error(e)
  process.exit(1)
})
