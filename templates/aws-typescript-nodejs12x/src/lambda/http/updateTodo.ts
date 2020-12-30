import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUser } from '../../utils/user'
import { TodoBL } from '../../businessLogic/TodoBL'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  //Related to the user
  const authorization: string = event.headers.Authorization
  const userId: string = getUser(authorization)

  const todosBL = new TodoBL(userId)


  let statusCode = 200

  try {
    await todosBL.updateTodo(todoId, updatedTodo)

  } catch (error) {
    statusCode = 500
  }


  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}