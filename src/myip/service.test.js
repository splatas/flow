const getIP = require('./service')
describe('Running myip test', () => {
  test('getIP should return a valid IP', async () => {
    const requestJSON = async () => {
      return { ip: '192.168.0.1' }
    }
    const pattern = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
    const response = await getIP(requestJSON)
    expect(response).toMatch(pattern)
  })

  test('getIP should return an error', async () => {
    const requestJSON = async () => {
      throw new Error('error')
    }
    try {
      await getIP(requestJSON)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
})
