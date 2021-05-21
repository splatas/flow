'use strict'
const schema = {
  summary: 'Generate Code of activation',
  tags: ['deco-retail'],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'ABC12'
              },
              exp: {
                type: 'integer',
                description: 'Tiempo de expiración en tiempo unix',
                example: 1620668011
              },
              msg: {
                type: 'string'
              },
              label: {
                type: 'string'
              }
            }
          },
          examples: {
            'New code': {
              value: {
                code: '1A2B8',
                exp: 1620668011
              }
            },
            'No retail': {
              value: {
                msg: 'no es deco retail',
                label: 'NOT_RETAIL'
              }
            }
          }
        }
      }
    }
  },
  operationId: 'get-retail-v1-code',
  description: 'Permite generar un codigo de activación a para un deco retail.',
  querystring: {
    schema: {
      type: 'string',
      example: '14:13:46:D1:E5:16'
    },
    type: 'object',
    properties: {
      macAddress: {
        type: 'string',
        description: 'Mac address del dispositivo',
      },
    },
    required: [
      'macAddress'
    ],
  },
}

module.exports = schema
