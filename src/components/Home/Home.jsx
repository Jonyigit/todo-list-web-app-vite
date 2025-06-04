import { useEffect, useState } from "react";
import TodoForm from "../TodoForm/TodoForm";
import TodoList from "../TodoList/TodoList";
import { v4 as uuidv4 } from "uuid";
import "./Home.scss";

export default function Home() {
    const [theme, setTheme] = useState(() => {
        return JSON.parse(localStorage.getItem("theme")) ?? false;
    });

    const [filter, setFilter] = useState("all");

    const [todo, setTodo] = useState(() => {
        const storedTodos = localStorage.getItem("todo");
        return storedTodos
            ? JSON.parse(storedTodos)
            : [
                  {
                      id: uuidv4(),
                      label: "Learn React",
                      isChecked: false,
                  },
              ];
    });

    useEffect(() => {
        document.body.classList.toggle("dark-mode", theme);
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("todo", JSON.stringify(todo));
    }, [todo]);

    return (
        <section className="todo-list-app">
            <div className="container-todo">
                <TodoForm setTodo={setTodo} theme={theme} setTheme={setTheme} />
                <TodoList todo={todo} setTodo={setTodo} filter={filter} setFilter={setFilter} />
            </div>
            <span className="drag-commit">Drag and drop to reorder list</span>
        </section>
    );
}
