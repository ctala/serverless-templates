import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoDataLayer } from '../../dataLayer/TodoDataLayer'
import { getUser } from '../../utils/user'

const AWS = require('aws-sdk')

const bucketName = process.env.BUCKET_NAME
const urlExpiration = 3600
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authorization: string = event.headers.Authorization
  const userId: string = getUser(authorization)

  console.log(todoId)
  const key = `${todoId}.png`;


  let statusCode = 200;
  let result = null;

  try {
    //We add the key to the attachmentUrl
    const todoDataLayer = new TodoDataLayer(userId);
    await todoDataLayer.addAttachmentUrl(todoId);

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: urlExpiration
    }

    //Put URL
    const url = s3.getSignedUrl('putObject', params);
    result = url;
    console.log('The URL is', url, params);
  }
  catch (e)
  {
    console.log(e);
    statusCode = 403;
  }


  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ uploadUrl: result })
  }
}
