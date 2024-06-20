// todo.js
import { defineStore } from "pinia";

export const useTodos = defineStore("todos", {
  state: () => ({
    todos: [],
    filter: "all",
    nextId: 0,
  }),
  getters: {
    filteredTodos() {
      if (this.filter === "finished") {
        return this.todos.filter((todo) => todo.isFinished);
      } else if (this.filter === "unfinished") {
        return this.todos.filter((todo) => !todo.isFinished);
      }
      return this.todos;
    },
  },
  actions: {
    async fetchTodos() {
      const response = await fetch(
        "https://6642ea4a3c01a059ea20c7c2.mockapi.io/TODOLIST"
      );
      this.todos = await response.json();
    },
    async addTodo(newTodoText) {
      const response = await fetch(
        "https://6642ea4a3c01a059ea20c7c2.mockapi.io/TODOLIST",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newTodoText,
            isFinished: false,
          }),
        }
      );
      const addedTodo = await response.json();
      this.todos.push(addedTodo);
    },
    async deleteTodo(todoId) {
      await fetch(
        `https://6642ea4a3c01a059ea20c7c2.mockapi.io/TODOLIST/${todoId}`,
        {
          method: "DELETE",
        }
      );
      this.todos = this.todos.filter((todo) => todo.id !== todoId);
    },
    async updateTodoStatus(todo) {
      await fetch(
        `https://6642ea4a3c01a059ea20c7c2.mockapi.io/TODOLIST/${todo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      );
    },
  },
});
