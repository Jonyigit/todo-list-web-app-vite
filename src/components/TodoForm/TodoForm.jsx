import { useForm } from "react-hook-form";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import moonIcon from "../../assets/icon/moon.svg";
import sunIcon from "../../assets/icon/sun.svg";
import "./TodoForm.scss";

export default function TodoForm({ setTodo, theme, setTheme }) {
    const [isChecked, setIsChecked] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        const label = data.todo.length <= 45 ? data.todo : data.todo.slice(0, 40) + "...";
        const newTodo = {
            id: uuidv4(),
            label: label,
            isChecked: isChecked,
        };

        setTodo((prev) => [newTodo, ...prev]);
        reset();
        setIsChecked(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                handleSubmit(onSubmit)();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <section className="todo-form">
            <div className="theme-box">
                <a href="#">Todo</a>
                <div className="theme" onClick={() => setTheme(!theme)}>
                    <img src={theme ? sunIcon : moonIcon} alt="Theme" />
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className={clsx({ "error-border": errors.todo })}>
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked((prev) => !prev)} />
                <input
                    type="text"
                    placeholder="Create a new todo…"
                    {...register("todo", {
                        required: "Can't be empty",
                        validate: (value) => value.trim().length > 0 || "just don't have any empty spaces",
                    })}
                />
                {errors.todo && <span>{errors.todo.message}</span>}
            </form>
        </section>
    );
}
