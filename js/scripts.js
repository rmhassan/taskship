// [{"id":"07332221-ff8b-41f8-b508-c1bc0211f50b","text":"some text","isCompleted":false,"isFavourite":false,"createdAt":"Wed Jun 22 2022 15:46:42 GMT+0500 (Pakistan Standard Time)"}]
// Get todos from localstorage
var currentDate = new Date();
var dd = String(currentDate.getDate()).padStart(2, "0");
var mm = String(currentDate.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = currentDate.getFullYear();

currentDate = yyyy + "-" + mm + "-" + dd;
// Elements
let todoInput = document.querySelector(".add-task-input");
let todoBtn = document.querySelector(".add-task-button");
let datepicker = document.querySelector(".filter-by-date-input");
let filterStatus = document.querySelector(".filter-by-status-input");

datepicker.value = currentDate;

function getTodos(currentDate = "", status = "all") {
  const todosJSON = localStorage.getItem("todos");
  if (todosJSON) {
    let todos = JSON.parse(todosJSON);
    if (currentDate) {
      todos = todos.filter((todo) => todo.createdAt === currentDate);
    }
    if (status && status != "all") {
      switch (status) {
        case "completed":
          todos = todos.filter((todo) => todo.isCompleted === true);
          break;
        case "remaining":
          todos = todos.filter((todo) => todo.isCompleted === false);
          break;
        case "favourite":
          todos = todos.filter((todo) => todo.isFavourite === true);
          break;
      }
    }
    return todos;
  }

  return [];
}
function saveTodos(todos) {
  let todosJSON = JSON.stringify(todos);
  localStorage.setItem("todos", todosJSON);
}

let todos = getTodos(currentDate);
/// need to sort out the order of execution

// wait for app to fetch todos
setTimeout(() => {
  if (!todos.length) {
    document.querySelector(".no-task-text").classList.add("visible");
  }
  if (todos.length) {
    generateTodos(todos);
  }
}, 100);

// Events
// Add task
todoBtn.addEventListener("click", () => {
  if (todoInput.value) {
    createTodo(todoInput.value, datepicker.value);
  }
  todoInput.value = "";
});
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.keyCode == 13) {
    if (e.target.value) {
      createTodo(e.target.value, datepicker.value);
    }
    todoInput.value = "";
  }
});
// prevent event on datepicker
datepicker.addEventListener("click", (e) => e.stopPropagation());
// filter by date
datepicker.addEventListener("change", (e) => {
  e.stopPropagation();
  let status = document.querySelector(".filter-by-status-input");
  let todos = getTodos(e.target.value, status);
  generateTodos(todos);
});
// filter by status
filterStatus.addEventListener("change", (e) => {
  let status = e.target.value;
  let currentDate = document.querySelector(".filter-by-date-input");
  let todos = getTodos(currentDate.value, status);
  generateTodos(todos);
});
// update task
document.addEventListener("focusout", (e) => {
  if (e.target.classList.contains("task-input")) {
    updateTodo(e.target.dataset.key, "text", e.target.value);
  }
});

document.addEventListener("click", (e) => {
  e.preventDefault();
  // toggle favourite
  if (e.target.parentNode.classList.contains("task-favourite")) {
    e.target.parentNode.classList.toggle("favourite");
    let taskContainer = e.target.closest(".task-actions");
    let taskKey = taskContainer.dataset.key;
    updateTodo(taskKey, "favourite");
  }
  // task complete
  if (e.target.parentNode.classList.contains("task-complete")) {
    e.target.parentNode.classList.add("hide");
    let taskContainer = e.target.closest(".task-actions");
    let taskKey = taskContainer.dataset.key;
    let taskInput = document.body.querySelector(`input[data-key="${taskKey}"]`);

    taskInput.classList.add("completed");
    taskContainer.querySelector(".task-redo").classList.remove("hide");
    updateTodo(taskKey, "complete");
  }
  // task redo
  if (e.target.parentNode.classList.contains("task-redo")) {
    e.target.parentNode.classList.add("hide");
    let taskContainer = e.target.closest(".task-actions");
    let taskKey = taskContainer.dataset.key;
    let taskInput = document.body.querySelector(`input[data-key="${taskKey}"]`);

    taskInput.classList.remove("completed");
    taskContainer.querySelector(".task-complete").classList.remove("hide");
    updateTodo(taskKey, "redo");
  }

  // delete Task
  if (e.target.parentNode.classList.contains("task-delete")) {
    let taskContainer = e.target.closest(".task-actions");
    let taskKey = taskContainer.dataset.key;
    taskContainer.closest(".task-item").remove();
    let todos = getTodos();
    if (todos.length) {
      todos = todos.filter((todo) => todo.id !== taskKey);
      saveTodos(todos);
    }
  }
});
