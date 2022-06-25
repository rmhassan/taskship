function generateTodos(todos) {
  let todoList = document.querySelector(".task-list");
  todoList.innerHTML = "";
  if (!todos.length) {
    document.querySelector(".no-task-text").classList.remove("hide");

    return;
  }
  document.querySelector(".no-task-text").classList.add("hide");

  todos.forEach((todo) => {
    let todoItem = document.createElement("li");
    todoItem.classList.add("task-item");
    let todoHTML = `
             <input type="text" class="task-input ${
               todo.isCompleted ? "completed" : ""
             }" value="${todo.text}" data-key="${todo.id}"/>
                <div class="task-actions" data-key="${todo.id}">
                  <a href="#" class="task-complete green  ${
                    todo.isCompleted ? "hide" : "visible"
                  }" title="Complete Task">
                    <i class="fa-solid fa-circle-check"></i>
                  </a>
                  <a href="#" class="task-redo yellow ${
                    todo.isCompleted ? "visible" : "hide"
                  }" title="Redo Task">
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                  </a>
                  <a href="#" class="task-favourite greyed ${
                    todo.isFavourite ? "favourite" : ""
                  }" title="Favourite">
                    <i class="fa-solid fa-star"></i>
                  </a>
                  <a href="#" class="task-delete danger" title="Delete Task">
                    <i class="fa-solid fa-trash-can"></i>
                  </a>
                </div>
   `;
    todoItem.innerHTML = todoHTML;
    todoList.appendChild(todoItem);
  });
}

// Add new task
function createTodo(todoText, currentDate) {
  let todoList = document.querySelector(".task-list");
  document.querySelector(".no-task-text").classList.add("hide");

  const newTodo = {
    id: uuidv4(),
    text: todoText,
    isCompleted: false,
    isFavourite: false,
    createdAt: currentDate,
  };
  let todos = getTodos();
  setTimeout(() => {
    todos.push(newTodo);
    saveTodos(todos);
  }, 100);

  let todoItem = document.createElement("li");
  todoItem.classList.add("task-item");
  let todoHTML = `
             <input type="text" class="task-input" value="${todoText}" data-key="${newTodo.id}"/>
                <div class="task-actions" data-key="${newTodo.id}">
                  <a href="#" class="task-complete green" title="Complete Task">
                    <i class="fa-solid fa-circle-check"></i>
                  </a>
                  <a href="#" class="task-redo yellow hide" title="Redo Task">
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                  </a>
                  <a href="#" class="task-favourite greyed" title="Favourite">
                    <i class="fa-solid fa-star"></i>
                  </a>
                  <a href="#" class="task-delete danger" title="Delete Task">
                    <i class="fa-solid fa-trash-can"></i>
                  </a>
                </div>
   `;
  todoItem.innerHTML = todoHTML;
  todoList.appendChild(todoItem);
}

function updateTodo(key, property, taskText = "") {
  let todos = getTodos();
  if (todos.length) {
    var foundIndex = todos.findIndex((todo) => todo.id == key);
    if (property == "favourite") {
      todos[foundIndex] = {
        ...todos[foundIndex],
        isFavourite: !todos[foundIndex].isFavourite,
      };
    }
    if (property == "complete") {
      todos[foundIndex] = {
        ...todos[foundIndex],
        isCompleted: !todos[foundIndex].isCompleted,
      };
    }
    if (property == "redo") {
      todos[foundIndex] = {
        ...todos[foundIndex],
        isCompleted: !todos[foundIndex].isCompleted,
      };
    }
    if (property == "text") {
      todos[foundIndex] = { ...todos[foundIndex], text: taskText };
    }
    saveTodos(todos);
  }
}
