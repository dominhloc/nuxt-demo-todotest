import { defineStore } from "pinia";

// @ts-ignore
export const useTodos = defineStore("todos", {
  state: () => ({
    todos: [],
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
    filteredTodos(state) {
      if (state.filter === "finished") {
        return state.todos.filter((todo) => todo.isFinished);
      } else if (state.filter === "unfinished") {
        return state.todos.filter((todo) => !todo.isFinished);
      }
      return state.todos;
    },
  },
  actions: {
    loadTodos() {
      if (process) {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
          this.todos = JSON.parse(storedTodos);
        }
        const storedNextId = localStorage.getItem("nextId");
        if (storedNextId) {
          this.nextId = Number(storedNextId);
        }
      }
    },
    saveTodos() {
      if (process) {
        localStorage.setItem("todos", JSON.stringify(this.todos));
        localStorage.setItem("nextId", this.nextId.toString());
      }
    },
    async fetchTodos() {
      // @ts-ignore
      this.loadTodos();
    },
    addTodo(text) {
      const newTodo = {
        text,
        id: this.nextId.toString(),
        isFinished: false,
        isFavorite: false,
      };
      this.todos.push(newTodo);
      this.nextId++;
      // @ts-ignore
      this.saveTodos();
    },
    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      // @ts-ignore
      this.saveTodos();
    },
    toggleFavorite(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.isFavorite = !todo.isFavorite;
        // @ts-ignore
        this.saveTodos();
      }
    },
    toggleFinished(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.isFinished = !todo.isFinished;
        // @ts-ignore
        this.saveTodos();
      }
    },
  },
  persist: true,
});
