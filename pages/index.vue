<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTodos } from "../stores/todo.js";

// @ts-ignore
const { filter, filteredTodos } = storeToRefs(useTodos());

const todosStore = useTodos();
const newTodoText = ref("");

onMounted(() => {
  // @ts-ignore
  todosStore.fetchTodos();
});

function addTodo() {
  if (!newTodoText.value) {
    return;
  }

  // @ts-ignore
  todosStore.addTodo(newTodoText.value);
  newTodoText.value = "";
}

/**
 * @param {any} id
 */
function deleteTodo(id) {
  // @ts-ignore
  todosStore.deleteTodo(id);
}

/**
 * @param {any} id
 */
function toggleFavorite(id) {
  // @ts-ignore
  todosStore.toggleFavorite(id);
}

/**
 * @param {any} id
 */
function toggleFinished(id) {
  // @ts-ignore
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
    <div class="p-5 h-[450px] w-96 bg-white rounded-md shadow-2xl">
      <div class="flex flex-col rounded-md">
        <div class="text-2xl font-serif font-semibold flex justify-center">
          New Todo
        </div>
      </div>
      <div class="flex space-x-2 flex-row justify-center">
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
          class="bg-blue-500 hover:bg-blue-800 hover:scale-110 duration-300 text-white w-36 rounded-md"
          :disabled="!newTodoText"
          @click="addTodo"
        >
          <div
            class="flex justify-center items-center w-full h-full rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path
                  d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                />
                <path
                  fill="white"
                  d="M10.5 20a1.5 1.5 0 0 0 3 0v-6.5H20a1.5 1.5 0 0 0 0-3h-6.5V4a1.5 1.5 0 0 0-3 0v6.5H4a1.5 1.5 0 0 0 0 3h6.5z"
                />
              </g>
            </svg>
          </div>
        </button>
      </div>
      <div class="h-[280px] overflow-auto mt-5 border rounded-md">
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
              class="h-7 w-7 flex justify-center items-center ml-2 hover:scale-125 duration-300 opacity-50"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                :fill="todo.isFavorite ? 'red' : 'gray'"
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
      <div class="flex justify-center space-x-3 mt-5 rounded-md">
        <button
          :class="[
            'w-28 rounded-md  hover:scale-110 duration-300 hover:font-semibold',
            // @ts-ignore
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
            // @ts-ignore
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
            'w-28 h-8 rounded-md hover:scale-110 duration-300 hover:font-semibold',
            // @ts-ignore
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
