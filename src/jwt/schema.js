'use strict'
const schema = {
  tags: ['common'],
  summary: 'Decoded user',
  description: 'Decoded user',
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization']
  },
  response: {
    200: {
      description: 'Decode user',
      type: 'object',
      properties: {
        iat: { type: 'number' },
        exp: { type: 'number' },
        data: {
          type: 'object',
          properties: {
            accountId: { type: 'number' },
            deviceToken: { type: 'string' },
            deviceInfo: {
              type: 'object',
              properties: {
                deviceName: { type: 'string' },
                type: { type: 'string' },
                deviceModel: { type: 'string' },
                deviceBrand: { type: 'string' },
                firmwareVersion: { type: 'string' },
                deviceOsVersion: { type: 'string' },
                ipAddress: { type: 'string' },
                casId: { type: 'string' },
                uuid: { type: 'string' },
                mac: { type: 'string' },
                appVersion: { type: 'string' },
                deviceType: { type: 'string' },
                networkType: { type: 'string' },
                deviceOs: { type: 'string' },
                playerType: { type: 'string' }
              }
            },

          }
        }
      }
    }
  },
}

module.exports = schema
