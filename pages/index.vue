<script setup>
import { ref, onMounted } from "vue";
// @ts-ignore
import { storeToRefs } from "pinia";
import { useTodos } from "../stores/todo.js";
import PiniaLogo from "../components/PiniaLogo.vue";

// Sử dụng store `useTodos` từ Pinia
const { filter, filteredTodos } = storeToRefs(useTodos());

// Khai báo các biến và thực hiện các thao tác liên quan đến todos
const todosStore = useTodos(); // Sử dụng store todos từ Pinia
const newTodoText = ref(""); // Biến để lưu trữ nội dung của todo mới

// Hàm được gọi khi component được mounted
onMounted(() => {
  todosStore.fetchTodos(); // Gọi hàm fetchTodos từ store để tải danh sách todos
});

// Hàm để thêm một todo mới
function addTodo() {
  if (!newTodoText.value) {
    return; // Nếu không có nội dung todo mới thì không làm gì cả
  }
  todosStore.addTodo(newTodoText.value); // Gọi hàm addTodo từ store để thêm todo mới
  newTodoText.value = ""; // Xóa nội dung trong input sau khi thêm todo
}

// Hàm để xóa một todo
function deleteTodo(id) {
  todosStore.deleteTodo(id); // Gọi hàm deleteTodo từ store để xóa todo với id tương ứng
}

// Hàm để đánh dấu một todo là yêu thích hoặc bỏ yêu thích
function toggleFavorite(id) {
  // Gọi hàm toggleFavorite từ store để thay đổi trạng thái yêu thích của todo
  todosStore.toggleFavorite(id);
}

// Hàm để đánh dấu một todo là đã hoàn thành hoặc chưa hoàn thành
function toggleFinished(id) {
  // Gọi hàm toggleFinished từ store để thay đổi trạng thái hoàn thành của todo
  todosStore.toggleFinished(id);
}

// Hàm để đặt bộ lọc cho danh sách todos
function setFilter(value) {
  filter.value = value; // Gán giá trị bộ lọc vào biến filter trong store
}
</script>

<template>
  <div
    class="h-screen w-screen bg-slate-200 flex-col flex justify-center items-center"
  >
    <div class="p-4 h-fit w-96 bg-white rounded-md shadow-2xl">
      <div class="flex flex-row justify-center items-center rounded-md mb-2">
        <div>
          <PiniaLogo />
        </div>
        <div
          class="text-2xl h-fit mt-2 font-serif font-semibold flex justify-center items-center"
        >
          New Todo
        </div>
        <div>
          <PiniaLogo />
        </div>
      </div>
      <div class="flex space-x-2 flex-row justify-center h-8">
        <label>
          <input
            class="border rounded-md p-1 h-8 w-72 bg-slate-200 flex justify-center items-center"
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
      <div class="h-[280px] overflow-auto mt-4 border rounded-md">
        <div class="space-y-3 rounded-md">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="flex hover:bg-slate-200 rounded-md p-1 border"
          >
            <div class="flex justify-center items-center ml-2">
              <input
                :checked="todo.isFinished"
                @change="toggleFinished(todo.id)"
                type="checkbox"
                class="h-4 w-4 hover:scale-150 duration-500"
              />
            </div>
            <div
              class="flex-1 flex ml-4 h-fit w-3 overflow-x-auto font-serif font-semibold items-center"
              :class="
                todo.isFinished ? ' line-through text-blue-600' : 'text-black'
              "
            >
              {{ todo.text }}
            </div>
            <button
              class="flex justify-center items-center ml-2 opacity-50"
              @click="deleteTodo(todo.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                class="hover:scale-150 duration-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"
                />
              </svg>
            </button>
            <button
              class="flex justify-center items-center ml-2"
              @click="toggleFavorite(todo.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                class="hover:scale-150 duration-500"
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
      <div
        class="flex justify-center space-x-3 mt-4 h-8 text-blue-600 font-semibold"
      >
        <button
          :class="[
            'w-28 rounded-full  hover:scale-110 duration-300 hover:font-semibold shadow-md text-sm',
            // @ts-ignore
            filter === 'all'
              ? 'bg-blue-500 text-white hover:bg-blue-800 duration-300'
              : 'bg-gray-200 hover:bg-gray-400 duration-300',
          ]"
          @click="setFilter('all')"
        >
          All Todos
        </button>
        <button
          :class="[
            'w-28 rounded-full hover:scale-110 duration-300 hover:font-semibold shadow-md text-sm',
            // @ts-ignore
            filter === 'finished'
              ? 'bg-blue-500 text-white hover:bg-blue-800 duration-300'
              : 'bg-gray-200 hover:bg-gray-400 duration-300',
          ]"
          @click="setFilter('finished')"
        >
          Finished
        </button>
        <button
          :class="[
            'w-28 rounded-full hover:scale-110 duration-300 hover:font-semibold shadow-md text-sm',
            // @ts-ignore
            filter === 'unfinished'
              ? 'bg-blue-500 text-white hover:bg-blue-800 duration-300'
              : 'bg-gray-200 hover:bg-gray-400 duration-300',
          ]"
          @click="setFilter('unfinished')"
        >
          Unfinished
        </button>
      </div>
    </div>
  </div>
</template>
