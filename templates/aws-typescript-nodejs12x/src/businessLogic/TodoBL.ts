import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
//Logger
import { createLogger } from '../utils/logger'
import { TodoDataLayer } from '../dataLayer/TodoDataLayer'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
const logger = createLogger('TodoBL');

export class TodoBL {
  private readonly userId: string;
  private readonly todoDataLayer: TodoDataLayer;

  constructor(userId: string) {
    this.userId = userId;
    this.todoDataLayer = new TodoDataLayer(userId);

  }


  /**
   * Returns all the todos for a particular user.
   */
  async getTodos(): Promise<TodoItem[]>
  {
    return this.todoDataLayer.getAllTodos();
  }


  /**
   * Creates a new todoitem.
   * @param newTodo
   */
  async createTodo(newTodo: CreateTodoRequest) {
    const todoId = uuid.v4();
    //Time Related Variables
    const createdAtTimestamp = Math.floor(Date.now() / 1000);
    const createdAt = new Date(createdAtTimestamp * 1000).toISOString();
    const updatedAt = createdAt;

    //New TodoItem
    const newItem: any = {
      todoId: todoId,
      userId: this.userId,
      attachmentUrl: null,
      done: false,
      timestamp: createdAtTimestamp,
      createdAt,
      updatedAt,
      ...newTodo
    }

    return new Promise<TodoItem>((resolve,reject)=>{
        this.todoDataLayer.create(newItem).then(resultedItem => {
          logger.info(resultedItem);
          resolve(resultedItem);
        }).catch(err=>{
          logger.info(err);
          reject(err);
        });
      }
    )


  }

  async updateTodo(todoId:string, updatedTodo: UpdateTodoRequest): Promise<void>
  {
    return this.todoDataLayer.update(todoId,updatedTodo);
  }


  /**+
   * Deletes a todoItem from the database for a particular user.
   * @param todoId
   */
  async deleteTodo(todoId:string)
  {
    return this.todoDataLayer.delete(todoId);

  }

}