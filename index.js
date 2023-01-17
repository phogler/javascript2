import useFetch from "./hooks/useFetch.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const limitFromUrl = urlSearchParams.get("limit");

const todoForm = document.querySelector(".todo-form");
const todosList = document.querySelector(".todos-list");

const todoInput = document.querySelector(".input-todo");
const todoInputButton = document.querySelector(".todo-submit");
const inputErrorMessage = document.querySelector(".todo-warning");

const limitForm = document.querySelector(".limit-form");
const limitInput = document.querySelector(".input-limit");

const dialog = document.querySelector(".dialog-warning");
const dialogIdText = document.querySelector(".dialog-todo-id");
const dialogCloseButton = document.querySelector(".dialog-close");

const API = new useFetch("https://jsonplaceholder.typicode.com/");

const fetchTodos = async () => {
    const data = await API.get("todos/");

    if (limitFromUrl) {
        const limitedData = data.slice(0, limitFromUrl);
        updateList(limitedData);
    } else {
        updateList(data);
    }
};

const updateList = (todos) => {
    todos.forEach((todo) => {
        todosList.insertAdjacentElement("beforeend", createTodoElement(todo));
    });
};

const createTodoElement = (todo) => {
    const element = document.createElement("li");
    element.classList.add("todo-item");
    element.classList.add(checkStatusType(todo.completed));

    const userIdElement = document.createElement("p");
    userIdElement.textContent = `UserID: ${todo.userId}`;

    const idElement = document.createElement("p");
    idElement.textContent = `ID: ${todo.id}`;

    const titleElement = document.createElement("p");
    titleElement.textContent = `Title: ${todo.title}`;

    const statusElement = document.createElement("p");
    statusElement.textContent = `Status ${todo.completed}`;
    statusElement.classList.add(checkStatusType(todo.completed));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    const statusButton = document.createElement("button");
    statusButton.textContent = "Status";
    statusButton.style.marginLeft = "5px";

    element.appendChild(userIdElement);
    element.appendChild(idElement);
    element.appendChild(statusElement);
    element.appendChild(titleElement);
    element.appendChild(deleteButton);
    element.appendChild(statusButton);

    deleteButton.addEventListener("click", async () => {
        if (!todo.completed) {
            dialog.showModal();
            dialogIdText.textContent = todo.id;
        } else {
            const res = await API.delete("todos/", todo.id);
            console.log(res, `todo was deleted.`);
            element.remove();
        }
    });

    statusButton.addEventListener("click", async () => {
        console.log(todo);
        todo.completed = !todo.completed;
        element.classList.toggle(checkStatusType(!todo.completed));
        element.classList.toggle(checkStatusType(todo.completed));
        statusElement.classList.toggle(checkStatusType(!todo.completed));
        statusElement.classList.toggle(checkStatusType(todo.completed));
        statusElement.textContent = `Status ${todo.completed}`;
        console.log(todo);
    });

    return element;
};

const checkStatusType = (status) => {
    switch (status) {
        case true:
            return "status-completed";
        case false:
            return "status-incomplete";
        default:
            return "";
    }
};

todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTodo = {
        userId: Math.floor(Math.random() * 10) + 1,
        title: todoInput.value.trim(),
        completed: false,
    };

    if (todoInput.value.trim() === "") {
        todoInput.focus();
        inputErrorMessage.classList.add("show");
    } else {
        const res = await API.post("todos/", newTodo);
        todosList.insertAdjacentElement("afterbegin", createTodoElement(res));
        console.log(res);
        todoInput.value = "";
    }
});

todoInput.addEventListener("input", () => {
    if (todoInput.value.trim() === "") {
        todoInput.focus();
        inputErrorMessage.classList.add("show");
        todoInputButton.disabled = true;
    } else {
        todoInput.focus();
        todoInputButton.disabled = false;
        inputErrorMessage.classList.remove("show");
    }
});

dialogCloseButton.addEventListener("click", () => {
    dialog.close();
});

limitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newUrl = new URL(window.location.href);
    const limitInputValue = limitInput.value;

    newUrl.searchParams.set("limit", limitInputValue);
    window.location.href = newUrl;
});

fetchTodos();
