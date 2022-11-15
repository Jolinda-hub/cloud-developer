import { APIGatewayProxyEvent } from 'aws-lambda'
//import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { deleteTodoItem } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
//import { createTodoItem } from '../helpers/todosAcess'
// import * as createError from 'http-errors'


// TODO: Implement businessLogic
export function todoBuilder(todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent)
  : TodoItem
{
  const todoId = uuid.v4()
    const todo = {
      todoId: todoId,
      userId: getUserId(event),
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: '',
      ...todoRequest
    }
      return todo
}

// export async function createTodo(
//   newTodo: CreateTodoRequest,
//   userId: string
// ): Promise<TodoItem> {
//   const todoId = uuid.v4()
//   const createdAt = new Date().toISOString()
//   const newItem = {
//     userId,
//     todoId,
//     createdAt,
//     done: false,
//     attachmentUrl: '',
//     ...newTodo
//   }

//   return await createTodoItem(newItem)
// }

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<string> {
  return deleteTodoItem(todoId, userId)
}