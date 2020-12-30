import { getUser } from '../../utils/user'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoBL } from '../../businessLogic/TodoBL'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event)
  const authorization: string = event.headers.Authorization;
  const userId: string = getUser(authorization);

  const todosBL = new TodoBL(userId);

  let items = [];
  let statusCode = 200;
  try {
    items = await todosBL.getTodos();
  }
  catch (e) {
    statusCode = 500;
  }



  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
