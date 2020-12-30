import { getDocClient } from '../utils/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getTodoImageUrl } from '../utils/s3'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { createLogger } from '../utils/logger'
const logger = createLogger('TodoDataLayer');
/**
 * This class represent all the databases connections for a TodoItem.
 */
export class TodoDataLayer {
  private readonly docClient: DocumentClient;
  private readonly todosTable: string;
  private readonly userId: string;


  constructor(
    userId:string = null
  ) {
    this.docClient = getDocClient();
    this.todosTable = process.env.TODOS_TABLE;
    this.userId = userId;

  }

  async getAllTodos(): Promise<TodoItem[]> {
    const params = {
      TableName: this.todosTable,
        IndexName : "userId-timestamp-index",
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames:{
      "#userId": "userId"
    },
      ExpressionAttributeValues: {
        ":userId": this.userId
      },
      ScanIndexForward : false
    }

    return new Promise((resolve,reject)=> {
      this.docClient.query(params, (err, data) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          const items: TodoItem[] = data.Items as TodoItem[];
          resolve(items);
        }

      });

    })

  }


  /**
   * Creates a new TodoItem.
   * @param newItem
   */
  async create(newItem: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: this.todosTable,
      Item: newItem
    }
    return new Promise((resolve, reject) => {
      this.docClient.put(params, (err) => {
        if (err) {
          logger.info(err);
          reject(err)
        } else {
          logger.info("Created",newItem);
          resolve(newItem)
        }
      })
    })
  }


  /**
   * Updates a todoItem
   * @param todoId
   * @param updatedTodo
   */
  async update(todoId:string,updatedTodo: UpdateTodoRequest) : Promise<void>{
    //Related to time
    const updatedAt: string = new Date(Date.now()).toISOString()

    //We update the item only if the logged user is the same as the creator
    const params: any = {
      TableName: this.todosTable,
      Key: {
        'todoId': todoId
      },
      UpdateExpression: 'set #name = :name, #dueDate=:dueDate, #done=:done, #updatedAt=:updatedAt',
      ConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done',
        '#updatedAt': 'updatedAt',
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done,
        ':updatedAt': updatedAt,
        ':userId': this.userId
      },
      ReturnValues: 'NONE'
    }

    return new Promise<void>((resolve, reject) => {
      this.docClient.update(params, (err) => {
        if (err) {
          logger.info(err);
          reject(err)
        } else {
          logger.info("Updated Successfully", params);
          resolve()
        }
      })
    })
  }


  /**
   * Deletes a todoItem for a particular User
   * @param todoId
   */
  async delete(todoId: string): Promise<void> {
    //If the user is not the creator of the todoitem, it can not be deleted
    const params = {
      TableName: this.todosTable,
      Key: {
        'todoId': todoId
      },
      ConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': this.userId
      }
    }

    return new Promise<void>((resolve, reject) => {
      this.docClient.delete(params, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })


  }

  async addAttachmentUrl(todoId: string): Promise<any> {
    const attachmentUrl = getTodoImageUrl(todoId)
    const params = {
      TableName: this.todosTable,
      Key: {
        'todoId': todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues:{
        ":attachmentUrl": attachmentUrl,
        ":userId" : this.userId
      },
      ReturnValues:"ALL_NEW"
    };

    console.log("Attempting a conditional update...");

    return new Promise((resolve, reject)=>{
      this.docClient.update(params, function(err, data) {
        if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
          reject(err);
        } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          resolve(data);
        }
      });
    })

  }
}
