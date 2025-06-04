import { useState } from "react";
import clsx from "clsx";
import "./TodoFooter.scss";

export default function TodoFooter({ todo, setTodo, setFilter, setArchive }) {
    const [active, setActive] = useState("all");

    const handleFilter = (filterType) => {
        setActive(filterType);
        setFilter(filterType);
    };

    const clearComplate = () => {
        const completedTodos = todo.filter((item) => item.isChecked);

        const remainingTodos = todo.filter((item) => !item.isChecked);

        if (completedTodos.length > 0) {
            setArchive((prev) => [...prev, ...completedTodos]);
        }

        setTodo(remainingTodos);
    };

    const itemsLeft = todo.filter((item) => !item.isChecked).length;

    return (
        <section className="todo-footer">
            <div className="container">
                <span>
                    {itemsLeft} item{itemsLeft !== 1 ? "s" : ""} left
                </span>
                <ul className="navbar">
                    <li onClick={() => handleFilter("all")} className={clsx({ active: active === "all" })}>
                        All
                    </li>
                    <li onClick={() => handleFilter("active")} className={clsx({ active: active === "active" })}>
                        Active
                    </li>
                    <li onClick={() => handleFilter("complated")} className={clsx({ active: active === "complated" })}>
                        Completed
                    </li>
                </ul>
                <span onClick={clearComplate}>Clear Completed</span>
            </div>
        </section>
    );
}
