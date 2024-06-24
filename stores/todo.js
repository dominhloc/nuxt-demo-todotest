// Import defineStore từ thư viện Pinia
import { defineStore } from "pinia";

// @ts-ignore
// Bỏ qua lỗi kiểm tra kiểu dữ liệu TypeScript vì Pinia có thể dẫn đến những lỗi này
export const useTodos = defineStore("todos", {
  // Định nghĩa state của store
  state: () => ({
    todos: [], // Danh sách các todo
    filter: "all", // Bộ lọc hiện tại của todo (có thể là "all", "finished", "unfinished")
    nextId: 0, // ID tiếp theo cho todo mới
  }),

  // Định nghĩa getters để lấy dữ liệu từ state
  getters: {
    // Trả về danh sách các todo đã hoàn thành.
    finishedTodos(state) {
      // Sử dụng phương thức filter trên mảng state.todos để lọc ra các todo có trạng thái 'isFinished' là true
      return state.todos.filter((todo) => todo.isFinished);
    },

    // Trả về danh sách các todo chưa hoàn thành.
    unfinishedTodos(state) {
      // Sử dụng filter để lọc ra các todo có trạng thái 'isFinished' là false.
      return state.todos.filter((todo) => !todo.isFinished);
    },

    // Trả về danh sách todos dựa trên bộ lọc hiện tại '(state.filter)'
    filteredTodos(state) {
      // Nếu state.filter là "finished"
      if (state.filter === "finished") {
        // Lọc và trả về danh sách các todo đã hoàn thành.
        return state.todos.filter((todo) => todo.isFinished);
        // Nếu state.filter là "unfinished"
      } else if (state.filter === "unfinished") {
        // Lọc và trả về danh sách các todo chưa hoàn thành.
        return state.todos.filter((todo) => !todo.isFinished);
      }
      // Nếu state.filter không phải là "finished" hoặc "unfinished", trả về danh sách todos ban đầu (state.todos)
      return state.todos;
    },
  },

  // Định nghĩa các actions để thay đổi state và thực hiện các tác vụ khác
  actions: {
    loadTodos() {
      // Kiểm tra process tồn tại (cho phép dùng localStorage trong trình duyệt)
      if (process) {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
          this.todos = JSON.parse(storedTodos); // Đọc danh sách todo từ localStorage
        }
        const storedNextId = localStorage.getItem("nextId");
        if (storedNextId) {
          this.nextId = Number(storedNextId); // Đọc ID tiếp theo từ localStorage
        }
      }
    },
    saveTodos() {
      // Kiểm tra process.client tồn tại (đang chạy trên client-side)
      if (process) {
        localStorage.setItem("todos", JSON.stringify(this.todos)); // Lưu danh sách todo vào localStorage
        localStorage.setItem("nextId", this.nextId.toString()); // Lưu ID tiếp theo vào localStorage
      }
    },

    async fetchTodos() {
      // @ts-ignore
      // Gọi action loadTodos để tải danh sách todo từ localStorage
      this.loadTodos();
    },

    addTodo(text) {
      const newTodo = {
        text,
        id: this.nextId.toString(),
        isFinished: false,
        isFavorite: false,
      };
      this.todos.push(newTodo); // Thêm todo mới vào danh sách
      this.nextId++; // Tăng ID tiếp theo lên để chuẩn bị cho todo tiếp theo
      // @ts-ignore
      this.saveTodos(); // Lưu lại danh sách todo vào localStorage

      // Trả về input trắng sau khi thêm todo thành công
      return "";
    },

    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id); // Xóa todo dựa trên ID
      // @ts-ignore
      this.saveTodos(); // Lưu lại danh sách todo sau khi xóa vào localStorage
    },

    toggleFavorite(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.isFavorite = !todo.isFavorite; // Đảo ngược trạng thái yêu thích của todo
        // @ts-ignore
        this.saveTodos(); // Lưu lại trạng thái mới vào localStorage
      }
    },

    toggleFinished(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.isFinished = !todo.isFinished; // Đảo ngược trạng thái hoàn thành của todo
        // @ts-ignore
        this.saveTodos(); // Lưu lại trạng thái mới vào localStorage
      }
    },
  },
  // Lựa chọn persist: true để Pinia tự động lưu trữ và khôi phục state khi cần thiết
  persist: true,
});
