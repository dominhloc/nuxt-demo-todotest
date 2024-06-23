<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTodos } from "../stores/todo.js";

const { filter, filteredTodos } = storeToRefs(useTodos());

const todosStore = useTodos();
const newTodoText = ref("");

onMounted(() => {
  todosStore.fetchTodos();
});

function addTodo() {
  if (!newTodoText.value) {
    return;
  }

  todosStore.addTodo(newTodoText.value);
  newTodoText.value = "";
}

function deleteTodo(id) {
  todosStore.deleteTodo(id);
}

function toggleFavorite(id) {
  todosStore.toggleFavorite(id);
}

function toggleFinished(id) {
  todosStore.toggleFinished(id);
}

function setFilter(value) {
  filter.value = value;
}
</script>

<template>
  <div
    class="h-screen w-screen bg-slate-200 flex-col flex justify-center items-center"
  >
    <div class="p-5 h-[530px] w-96 bg-white rounded-md shadow-2xl">
      <div class="flex flex-col border rounded-md">
        <PiniaLogo class="hover:scale-125 duration-300" />
        <div class="text-2xl font-serif font-semibold flex justify-center">
          New Todo
        </div>
      </div>
      <div class="flex space-x-2 mt-2 flex-row justify-center">
        <label>
          <input
            class="border rounded-md p-1 w-72 bg-slate-200"
            v-model="newTodoText"
            type="text"
            @keypress.enter="addTodo"
            placeholder=" New add ..."
          />
        </label>
        <button
          class="bg-blue-500 hover:bg-blue-800 hover:scale-110 duration-300 text-white w-36 p-1 rounded-md"
          :disabled="!newTodoText"
          @click="addTodo"
        >
          Add
        </button>
      </div>
      <div class="h-[280px] overflow-auto mt-5 border">
        <div class="space-y-4 rounded-md">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="flex hover:bg-slate-200 rounded-md p-1 border"
          >
            <div class="w-7 h-7 flex justify-center items-center">
              <input
                :checked="todo.isFinished"
                @change="toggleFinished(todo.id)"
                type="checkbox"
                class="h-4 w-4"
              />
            </div>
            <div
              class="flex-1 flex ml-2 font-serif font-semibold items-center"
              :class="
                todo.isFinished ? 'line-through text-blue-600' : 'text-black'
              "
            >
              {{ todo.text }}
            </div>
            <button
              class="h-7 w-7 flex justify-center items-center ml-2 hover:scale-125 duration-300"
              @click="deleteTodo(todo.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"
                />
              </svg>
            </button>
            <button
              class="h-7 w-7 flex justify-center items-center ml-2 hover:scale-125 duration-300"
              @click="toggleFavorite(todo.id)"
            >
              <!-- Your favorite icon SVG here -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                :fill="todo.isFavorite ? 'red' : 'black'"
              >
                <path
                  d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                />
              </svg>
            </button>
          </li>
        </div>
      </div>
      <!-- Filter buttons -->
      <div class="flex justify-center space-x-3 mt-5 border rounded-md p-2">
        <button
          :class="[
            'w-28 rounded-md  hover:scale-110 duration-300 hover:font-semibold',
            filter === 'all'
              ? 'bg-blue-500 text-white hover:bg-blue-800 duration-300'
              : 'bg-gray-300 hover:bg-gray-400 duration-300',
          ]"
          @click="setFilter('all')"
        >
          All
        </button>
        <button
          :class="[
            'w-28 rounded-md  hover:scale-110 duration-300 hover:font-semibold',
            filter === 'finished'
              ? 'bg-blue-500 text-white hover:bg-blue-800 duration-300'
              : 'bg-gray-300 hover:bg-gray-400 duration-300',
          ]"
          @click="setFilter('finished')"
        >
          Finished
        </button>
        <button
          :class="[
            'w-28 rounded-md hover:scale-110 duration-300 hover:font-semibold',
            filter === 'unfinished'
              ? 'bg-blue-500 text-white hover:bg-blue-800 duration-300'
              : 'bg-gray-300 hover:bg-gray-400 duration-300',
          ]"
          @click="setFilter('unfinished')"
        >
          Unfinished
        </button>
      </div>
    </div>
  </div>
</template>
