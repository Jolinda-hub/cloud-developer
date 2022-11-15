import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { getUserId } from '../utils'
//import { createTodo } from '../../businessLogic/todos'
import { createTodo } from '../../helpers/todosAcess'
import { todoBuilder } from '../../helpers/todos'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item
    const todo = todoBuilder(newTodo, event)
    const createdTodo = createTodo(todo);

    return {
      statusCode: 201,
      body: JSON.stringify({
          createdTodo
      })
  }
  }
)

// const userId = getUserId(event)
//     const newItem = await createTodo(newTodo, userId)

//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//           item: newItem
//       })
//   }
//   }
// )

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
