import { defineStore } from 'pinia';
import type { Todo, TodoForm, TodoUpdateForm } from '../interfaces';
import { createTodo, deleteTodo, fetchAllTodo, fetchSearchTodo, updateTodo } from '../services';

interface TodoState {
  allTodo: Todo[] | null;
  loaded: boolean | false;
}

export const useTodo = defineStore('todo', {
  state: (): TodoState => ({
    allTodo: null,
    loaded: false
  }),
  actions: {
    async createTodo(todoForm: TodoForm) {
      await createTodo(todoForm).then((response) => {
        if (this.allTodo) {
          // ajoute le todo dans le tableau
          this.allTodo.push(response);
          this.allTodo = this.allTodo.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
      });
    },
    async updateTodo(id: string, todoForm: TodoUpdateForm) {
      await updateTodo(id, todoForm).then((response) => {
        if (this.allTodo) {
          // mets à jour le todo dans le tableau
          this.allTodo = this.allTodo.map((todo) =>
            todo.id === response.id ? { ...todo, ...response } : todo
          );
        }
      });
    },
    async deleteTodo(id: string) {
      await deleteTodo(id).then((response) => {
        if (this.allTodo) {
          // supprime le todo du tableau
          this.allTodo = this.allTodo.filter((todo) => todo.id !== Number(response.id));
        }
      });
    },
    async fetchAllTodo() {
      this.allTodo = await fetchAllTodo();
      this.loaded = true;
    },
    async fetchSearchTodo(query: string) {
      this.allTodo = await fetchSearchTodo(query);
      this.loaded = true;
    }
  }
});
