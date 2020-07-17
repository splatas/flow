'use strict'

async function getIP(requestJSON) {
  try {
    const url = 'https://api.myip.com/?format=json'
    const response = await requestJSON(url)
    return response.ip
  } catch (err) {
    throw Error(err.toString)
  }
}
module.exports = getIP
