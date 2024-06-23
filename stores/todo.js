import { defineStore } from "pinia";

const API_URL = "https://6642ea4a3c01a059ea20c7c2.mockapi.io/TODOLIST";

export const useTodos = defineStore("todos", {
  state: () => ({
    /** @type {{ text: string, id: string, isFinished: boolean, isFavorite: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: "all",
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      return state.todos.filter((todo) => todo.isFinished);
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished);
    },
    /**
     * @returns {{ text: string, id: string, isFinished: boolean, isFavorite: boolean }[]}
     */
    filteredTodos(state) {
      if (state.filter === "finished") {
        // @ts-ignore
        return state.finishedTodos;
      } else if (state.filter === "unfinished") {
        // @ts-ignore
        return state.unfinishedTodos;
      }
      return state.todos;
    },
  },
  actions: {
    async fetchTodos() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        this.todos = data;
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    },
    async addTodo(text) {
      try {
        const newTodo = { text, isFinished: false, isFavorite: false };
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });
        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
        const data = await response.json();
        this.todos.push(data);
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    },
    async deleteTodo(id) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    },
    async toggleFavorite(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (!todo) return;
      try {
        const updatedTodo = { ...todo, isFavorite: !todo.isFavorite };
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        });
        if (!response.ok) {
          throw new Error("Failed to toggle favorite");
        }
        todo.isFavorite = !todo.isFavorite;
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    async toggleFinished(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (!todo) return;
      try {
        const updatedTodo = { ...todo, isFinished: !todo.isFinished };
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        });
        if (!response.ok) {
          throw new Error("Failed to toggle finished");
        }
        todo.isFinished = !todo.isFinished;
      } catch (error) {
        console.error("Failed to toggle finished:", error);
      }
    },
  },
});
