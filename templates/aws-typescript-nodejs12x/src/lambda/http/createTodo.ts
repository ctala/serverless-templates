//Imports
import { getUser } from '../../utils/user'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoBL } from '../../businessLogic/TodoBL'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const authorization: string = event.headers.Authorization
  const userId: string = getUser(authorization)

  const todoBL = new TodoBL(userId);

  //Default Result Code
  let statusCode = 200;
  let returnBody = {};

  try {
    returnBody = await todoBL.createTodo(newTodo);
  }catch (e) {
      statusCode = 500;
  }


  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item : returnBody })
  }
}
