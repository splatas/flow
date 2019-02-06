#!/usr/bin/env node
const got = require('got')
const env = process.env.NODE_ENV || 'local'

const fixtures = {
  prod: {
    'api': 'https://api.flow.com.ar/api/v1',
    'user': 'flowpruebas1@gmail.com',
    'pass': 'Prueba1',
    'minerva': 'http://geo.mnedge.cvattv.com.ar:7780/xtv-ws-client/api',
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4NDg1MjM0MTQsImRhdGEiOnsiYWNjb3VudElkIjoiZ2VzdGlvbmRlcHJvZHVjdG9zLmN2QGdtYWlsLmNvbSIsImNvb2tpZSI6IkpTRVNTSU9OSUQ9TXprMk56STZRMVZUVkU5TlJWSkpSQ016TWpjeE5EcEVSVlpVV1ZCRkkyTnNiM1ZrWDJOc2FXVnVkRHBOUVVNalpUTXhNVFk1TVRaaE9EWTVPbE5GVWtsQlRDTTJORGN4TVRFeU9sVlZTVVFqWlRNeE1UWTVNVFpoT0RZNU5qWmxaV1ZoWldJME9EaGpNREkzWldNeU9URT06MTU0MzQyNTgxNDpBTSttYjRyMGMxWm5STElLdFZKb1BZeE5xYmIvQUNHeXBSbm1BUXZWdEdiMVZOZzAzekFkT2cvWCIsImZvbGxvdyI6eyJwcmltYXJ5Ijp7ImlkIjozOTY3MiwicGluIjoiMTIzNCJ9LCJjdXN0b21lcklkIjoiMzI3MTQiLCJhY2NvdW50SWQiOjM5NjcyLCJkZXZpY2VJZCI6NjQ3MTExMiwidmNhcyI6eyJjYW5hbWUiOiJDYWJsZXZpc2lvblNBIiwiY2FzcnYiOiIyMDAuODkuMTkxLjEyMzo4MCJ9LCJwdXJjaGFzZUFsbG93ZWQiOiJ0cnVlIC13dmJhc2V1cmw9aHR0cDovLzIwMC44OS4xOTEuNTI6ODAiLCJhbmFseXRpY3MiOnsiaG9zdCI6Im1pbmVydmEtc2FhczEtMTkzOTI2ODUyLnVzLWVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbSIsInBvcnQiOjgwODAsIm1heEV2ZW50cyI6NSwidGltZW91dCI6MSwia2V5IjoiNmVkNy0yMjNkLTQ2MzEtOGJiNSIsInNlcnZpY2VQcm92aWRlcklkIjoiY3ZhbGFiIiwidmVyc2lvbiI6IjIuMCIsInJhbmRvbWl6YXRpb25XaW5kb3ciOjE4MH0sInJlY29tbWVuZGF0aW9ucyI6eyJ0aW1lVGhyZXNob2xkIjoxNSwicHJvdmlkZXJJZCI6MSwidmVyc2lvbiI6IjMuMCIsInZvZFJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfcmVjb21tZW5kYXRpb24vMSIsImxpdmV0dlJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9saXZlX3R2X3JlY29tbWVuZGF0aW9uLzEiLCJ2b2RUcmVuZGluZ1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfdHJlbmRpbmcvMSIsImxpdmV0dlRyZW5kaW5nUGF0aCI6Ii9hcGkvY29udGVudC9saXN0L2xpdmVfdHZfdHJlbmRpbmcvMSIsImR5bmFtaWNTdHJlYW1zUm9vdFBhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9keW5hbWljX3Jvb3Rfdm9kLzEiLCJpc0xpdmV0dlJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjEsImlzVm9kVHJlbmRpbmdFbmFibGVkIjoxLCJpc0xpdmV0dlRyZW5kaW5nRW5hYmxlZCI6MSwiaXNEeW5hbWljU3RyZWFtc1Jvb3RFbmFibGVkIjoxLCJpc1ZvZFJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjF9LCJycyI6Imh0dHBzOi8vMjAwLjg5LjE5MS43Mjo0NDQ2L3h0dnNjaGVkdWxlL3Jlc3QvIiwibG9jYWxpemF0aW9uSWQiOjF9fSwiaWF0IjoxNTQzMzM5NDE0fQ.mXXQB7hf8DFOQ3VWDNiSCIv5WrgGA4YvNtFVlfDZQ-w',
  },
  preprod: {
    api: 'https://gw-prepro.flow.com.ar/api/v1',
    user: 'test45@cvattv.com.ar',
    pass: 'abcd1234',
    minerva: 'http://geo.mnedge.prepro.cvattv.com.ar:7780/xtv-ws-client/api',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4NDkyMDIyMDMsImRhdGEiOnsiYWNjb3VudElkIjoidGVzdDQ1QGN2YXR0di5jb20uYXIiLCJjb29raWUiOiJKU0VTU0lPTklEPU5USTRPa05WVTFSUFRVVlNTVVFqT1RrNU1EUTFPa1JGVmxSWlVFVWpZMnh2ZFdSZlkyeHBaVzUwT2sxQlF5Tm1PR1l4TlRsbVlqaGtOREk2VTBWU1NVRk1JelV4T0RFM09sVlZTVVFqWmpobU1UVTVabUk0WkRReU5HTXdNVGMxTkdObE1XTXlaV1kwT1RKbE9UST06MTU0NDEwNDYwMzpBQ3Z3aFdhWkpmOXVyWEU0UlUyN2pocGZQQlNTQUNURVVXNFl1YThYVEpOWE9jdjlSS0t6VGt1NiIsImZvbGxvdyI6eyJwcmltYXJ5Ijp7ImlkIjo1MjgsInBpbiI6IjAifSwiY3VzdG9tZXJJZCI6Ijk5OTA0NSIsImFjY291bnRJZCI6NTI4LCJkZXZpY2VJZCI6NTE4MTcsInZjYXMiOnsiY2FuYW1lIjoiQ2FibGV2aXNpb25TQSIsImNhc3J2IjoiMjAwLjg5LjE5MC4xMjM6ODAifSwicHVyY2hhc2VBbGxvd2VkIjoidHJ1ZSIsImFuYWx5dGljcyI6eyJob3N0IjoibWluZXJ2YS1zYWFzMS0xOTM5MjY4NTIudXMtZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tIiwicG9ydCI6ODA4MCwibWF4RXZlbnRzIjo1LCJ0aW1lb3V0IjoxLCJrZXkiOiI3MzQwLTI0Y2ItNGI2Yi1iOWE3Iiwic2VydmljZVByb3ZpZGVySWQiOiJjdmFwcmVwcm9kIiwidmVyc2lvbiI6IjIuMCIsInJhbmRvbWl6YXRpb25XaW5kb3ciOjE4MH0sInJlY29tbWVuZGF0aW9ucyI6eyJ0aW1lVGhyZXNob2xkIjoxNSwicHJvdmlkZXJJZCI6MSwidmVyc2lvbiI6IjMuMCIsInZvZFJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfcmVjb21tZW5kYXRpb24vMSIsImxpdmV0dlJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9saXZlX3R2X3JlY29tbWVuZGF0aW9uLzEiLCJ2b2RUcmVuZGluZ1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfdHJlbmRpbmcvMSIsImxpdmV0dlRyZW5kaW5nUGF0aCI6Ii9hcGkvY29udGVudC9saXN0L2xpdmVfdHZfdHJlbmRpbmcvMSIsImR5bmFtaWNTdHJlYW1zUm9vdFBhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9keW5hbWljX3Jvb3Rfdm9kLzEiLCJpc0xpdmV0dlJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjEsImlzVm9kVHJlbmRpbmdFbmFibGVkIjoxLCJpc0xpdmV0dlRyZW5kaW5nRW5hYmxlZCI6MSwiaXNEeW5hbWljU3RyZWFtc1Jvb3RFbmFibGVkIjoxLCJpc1ZvZFJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjF9LCJycyI6Imh0dHBzOi8vMjAwLjg5LjE5MC43Mjo0NDQ2L3h0dnNjaGVkdWxlL3Jlc3QvIiwibG9jYWxpemF0aW9uSWQiOjJ9fSwiaWF0IjoxNTQ0MDE4MjAzfQ.N2G5TgnPyylBueh2c3fvVCrLApIRnP2qmZwDEbMD43Y',
  },
  staging: {
    'api': 'https://gw-ff-stg.cablevisionflow.com.ar/api/v1',
    'user': 'flowpruebas1@gmail.com',
    'pass': 'Prueba1',
    'minerva': 'http://geo.mnedge.cvattv.com.ar:7780/xtv-ws-client/api',
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4NDg1MjM0MTQsImRhdGEiOnsiYWNjb3VudElkIjoiZ2VzdGlvbmRlcHJvZHVjdG9zLmN2QGdtYWlsLmNvbSIsImNvb2tpZSI6IkpTRVNTSU9OSUQ9TXprMk56STZRMVZUVkU5TlJWSkpSQ016TWpjeE5EcEVSVlpVV1ZCRkkyTnNiM1ZrWDJOc2FXVnVkRHBOUVVNalpUTXhNVFk1TVRaaE9EWTVPbE5GVWtsQlRDTTJORGN4TVRFeU9sVlZTVVFqWlRNeE1UWTVNVFpoT0RZNU5qWmxaV1ZoWldJME9EaGpNREkzWldNeU9URT06MTU0MzQyNTgxNDpBTSttYjRyMGMxWm5STElLdFZKb1BZeE5xYmIvQUNHeXBSbm1BUXZWdEdiMVZOZzAzekFkT2cvWCIsImZvbGxvdyI6eyJwcmltYXJ5Ijp7ImlkIjozOTY3MiwicGluIjoiMTIzNCJ9LCJjdXN0b21lcklkIjoiMzI3MTQiLCJhY2NvdW50SWQiOjM5NjcyLCJkZXZpY2VJZCI6NjQ3MTExMiwidmNhcyI6eyJjYW5hbWUiOiJDYWJsZXZpc2lvblNBIiwiY2FzcnYiOiIyMDAuODkuMTkxLjEyMzo4MCJ9LCJwdXJjaGFzZUFsbG93ZWQiOiJ0cnVlIC13dmJhc2V1cmw9aHR0cDovLzIwMC44OS4xOTEuNTI6ODAiLCJhbmFseXRpY3MiOnsiaG9zdCI6Im1pbmVydmEtc2FhczEtMTkzOTI2ODUyLnVzLWVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbSIsInBvcnQiOjgwODAsIm1heEV2ZW50cyI6NSwidGltZW91dCI6MSwia2V5IjoiNmVkNy0yMjNkLTQ2MzEtOGJiNSIsInNlcnZpY2VQcm92aWRlcklkIjoiY3ZhbGFiIiwidmVyc2lvbiI6IjIuMCIsInJhbmRvbWl6YXRpb25XaW5kb3ciOjE4MH0sInJlY29tbWVuZGF0aW9ucyI6eyJ0aW1lVGhyZXNob2xkIjoxNSwicHJvdmlkZXJJZCI6MSwidmVyc2lvbiI6IjMuMCIsInZvZFJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfcmVjb21tZW5kYXRpb24vMSIsImxpdmV0dlJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9saXZlX3R2X3JlY29tbWVuZGF0aW9uLzEiLCJ2b2RUcmVuZGluZ1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfdHJlbmRpbmcvMSIsImxpdmV0dlRyZW5kaW5nUGF0aCI6Ii9hcGkvY29udGVudC9saXN0L2xpdmVfdHZfdHJlbmRpbmcvMSIsImR5bmFtaWNTdHJlYW1zUm9vdFBhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9keW5hbWljX3Jvb3Rfdm9kLzEiLCJpc0xpdmV0dlJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjEsImlzVm9kVHJlbmRpbmdFbmFibGVkIjoxLCJpc0xpdmV0dlRyZW5kaW5nRW5hYmxlZCI6MSwiaXNEeW5hbWljU3RyZWFtc1Jvb3RFbmFibGVkIjoxLCJpc1ZvZFJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjF9LCJycyI6Imh0dHBzOi8vMjAwLjg5LjE5MS43Mjo0NDQ2L3h0dnNjaGVkdWxlL3Jlc3QvIiwibG9jYWxpemF0aW9uSWQiOjF9fSwiaWF0IjoxNTQzMzM5NDE0fQ.mXXQB7hf8DFOQ3VWDNiSCIv5WrgGA4YvNtFVlfDZQ-w',
  },
  develop: {
    'api': 'https://gw-ff-dev.cablevisionflow.com.ar/api/v1',
    'user': 'flowpruebas1@gmail.com',
    'pass': 'Prueba1',
    'minerva': 'http://geo.mnedge.cvattv.com.ar:7780/xtv-ws-client/api',
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4NDg1MjM0MTQsImRhdGEiOnsiYWNjb3VudElkIjoiZ2VzdGlvbmRlcHJvZHVjdG9zLmN2QGdtYWlsLmNvbSIsImNvb2tpZSI6IkpTRVNTSU9OSUQ9TXprMk56STZRMVZUVkU5TlJWSkpSQ016TWpjeE5EcEVSVlpVV1ZCRkkyTnNiM1ZrWDJOc2FXVnVkRHBOUVVNalpUTXhNVFk1TVRaaE9EWTVPbE5GVWtsQlRDTTJORGN4TVRFeU9sVlZTVVFqWlRNeE1UWTVNVFpoT0RZNU5qWmxaV1ZoWldJME9EaGpNREkzWldNeU9URT06MTU0MzQyNTgxNDpBTSttYjRyMGMxWm5STElLdFZKb1BZeE5xYmIvQUNHeXBSbm1BUXZWdEdiMVZOZzAzekFkT2cvWCIsImZvbGxvdyI6eyJwcmltYXJ5Ijp7ImlkIjozOTY3MiwicGluIjoiMTIzNCJ9LCJjdXN0b21lcklkIjoiMzI3MTQiLCJhY2NvdW50SWQiOjM5NjcyLCJkZXZpY2VJZCI6NjQ3MTExMiwidmNhcyI6eyJjYW5hbWUiOiJDYWJsZXZpc2lvblNBIiwiY2FzcnYiOiIyMDAuODkuMTkxLjEyMzo4MCJ9LCJwdXJjaGFzZUFsbG93ZWQiOiJ0cnVlIC13dmJhc2V1cmw9aHR0cDovLzIwMC44OS4xOTEuNTI6ODAiLCJhbmFseXRpY3MiOnsiaG9zdCI6Im1pbmVydmEtc2FhczEtMTkzOTI2ODUyLnVzLWVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbSIsInBvcnQiOjgwODAsIm1heEV2ZW50cyI6NSwidGltZW91dCI6MSwia2V5IjoiNmVkNy0yMjNkLTQ2MzEtOGJiNSIsInNlcnZpY2VQcm92aWRlcklkIjoiY3ZhbGFiIiwidmVyc2lvbiI6IjIuMCIsInJhbmRvbWl6YXRpb25XaW5kb3ciOjE4MH0sInJlY29tbWVuZGF0aW9ucyI6eyJ0aW1lVGhyZXNob2xkIjoxNSwicHJvdmlkZXJJZCI6MSwidmVyc2lvbiI6IjMuMCIsInZvZFJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfcmVjb21tZW5kYXRpb24vMSIsImxpdmV0dlJlY29tbWVuZGF0aW9uc1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9saXZlX3R2X3JlY29tbWVuZGF0aW9uLzEiLCJ2b2RUcmVuZGluZ1BhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC92b2RfdHJlbmRpbmcvMSIsImxpdmV0dlRyZW5kaW5nUGF0aCI6Ii9hcGkvY29udGVudC9saXN0L2xpdmVfdHZfdHJlbmRpbmcvMSIsImR5bmFtaWNTdHJlYW1zUm9vdFBhdGgiOiIvYXBpL2NvbnRlbnQvbGlzdC9keW5hbWljX3Jvb3Rfdm9kLzEiLCJpc0xpdmV0dlJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjEsImlzVm9kVHJlbmRpbmdFbmFibGVkIjoxLCJpc0xpdmV0dlRyZW5kaW5nRW5hYmxlZCI6MSwiaXNEeW5hbWljU3RyZWFtc1Jvb3RFbmFibGVkIjoxLCJpc1ZvZFJlY29tbWVuZGF0aW9uc0VuYWJsZWQiOjF9LCJycyI6Imh0dHBzOi8vMjAwLjg5LjE5MS43Mjo0NDQ2L3h0dnNjaGVkdWxlL3Jlc3QvIiwibG9jYWxpemF0aW9uSWQiOjF9fSwiaWF0IjoxNTQzMzM5NDE0fQ.mXXQB7hf8DFOQ3VWDNiSCIv5WrgGA4YvNtFVlfDZQ-w',
  },
}

fixtures.local = JSON.parse(JSON.stringify(fixtures.develop))

const body = {
  accountId: fixtures[env].user,
  password: fixtures[env].pass,
  clientCasId: '2da0b144f32c9102e20df62a7eb953af',
  deviceName: 'Linux x86_64',
  devicePlatform: 'WindowsPC',
  deviceType: 'cloud_client'
}

const url = fixtures[env].api + '/auth/login'

got(url, { body, method: 'post', json: true, throwHttpErrors: false })
  .then(req => {
    if (req.statusCode === 200) {
      fixtures[env].token = req.body.jwt
      console.log(JSON.stringify(fixtures, null, 2))
    } else {
      console.error(req.statusCode, req.body)
      process.exit(1)
    }
  })
