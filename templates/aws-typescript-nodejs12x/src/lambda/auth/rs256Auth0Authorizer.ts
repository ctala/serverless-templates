
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

const middy = require('@middy/core')
const secretsManager = require('@middy/secrets-manager')

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

 

export const handler = middy(async (event: CustomAuthorizerEvent, context : any): Promise<CustomAuthorizerResult> => {

  const CERTIFICATE = context.CERTIFICATE;

  try {
    const jwtToken = verifyToken(event.authorizationToken, decodeBase64(CERTIFICATE.encodedCert));
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
});

function verifyToken(authHeader: string, certificate:string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, certificate, { algorithms: ['RS256'] }) as JwtToken
}


  /**
    The certificate is base64 encoded in Secret Manager
   */
 handler.use(secretsManager({
  cache: true,
  secrets: {
    CERTIFICATE: 'dev/cert/auth0'
  }
}))

 

function decodeBase64(data:string){
  const buff = new Buffer(data, 'base64');
return buff.toString('ascii');
}