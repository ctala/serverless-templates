import { getAWSClient } from './awsClient'

const AWS = getAWSClient();

export function getDocClient() {
  //If it is local we use the default SDK and a local DynamoDB
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient();
}