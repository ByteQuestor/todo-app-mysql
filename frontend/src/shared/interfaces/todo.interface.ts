export interface Todo {
  id: number;
  date: string;
  text: string;
  completed: boolean;
}

export interface TodoForm extends Partial<Todo> {
  text: string;
}

export interface TodoUpdateForm extends Partial<Todo> {
  completed: boolean;
}
