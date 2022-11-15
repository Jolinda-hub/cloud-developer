import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoUpdate } from '../models/TodoUpdate';

import { TodoItem } from "../models/TodoItem"

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
  }

export async function getAllTodosByUser(userId: string ): Promise<TodoItem[]> {
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
        ':userId': userId
    },
    ScanIndexForward: false
  }).promise()
  const items = result.Items

  return items as TodoItem[]
}

export async function getTodoById(todoId: string ): Promise<TodoItem> {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
        ':todoId': todoId
    },
    ScanIndexForward: false
  }).promise()
  const items = result.Items
  if (items.length !== 0)
    return result.Items[0] as TodoItem

  return null
}

export async function updateTodo(todo: TodoItem ): Promise<TodoItem> {
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId: todo.userId, 
      todoId: todo.todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
        ':attachmentUrl': todo.attachmentUrl
    }
  }).promise()

  return result.Attributes as TodoItem
}

export async function deleteTodoItem(todoId: string, userId: string): Promise<string> {
    await docClient.delete({
    TableName: todosTable,
    Key: {
      todoId,
      userId
    }
  }).promise()
  return todoId as string
}

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }