import { getUser } from '../../utils/user'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoBL } from '../../businessLogic/TodoBL'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log(todoId)

  const authorization: string = event.headers.Authorization
  const userId: string = getUser(authorization)

  const todosBL = new TodoBL(userId);

  let statusCode: number = 200
  try {
    await todosBL.deleteTodo(todoId);
  } catch (e) {
    if (e.code = 'ConditionalCheckFailedException') {
      statusCode = 403
    } else {
      console.log(e)
      statusCode = 500
    }

  } finally {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  }



}
