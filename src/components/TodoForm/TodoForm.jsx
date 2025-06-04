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
        if (!data.todo.trim()) return;

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
                e.preventDefault();
                handleSubmit(onSubmit)();
            }
        };

        const inputElement = document.querySelector('input[type="text"]');
        if (inputElement) {
            inputElement.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            const inputElement = document.querySelector('input[type="text"]');
            if (inputElement) {
                inputElement.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [handleSubmit, isChecked]);

    return (
        <section className="todo-form">
            <div className="theme-box">
                <a href="#">Todo</a>
                <div className="theme" onClick={() => setTheme(!theme)}>
                    <img src={theme ? sunIcon : moonIcon} alt="Theme" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={clsx({ "error-border": errors.todo })}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked((prev) => !prev)}
                    className="checkbox-input"
                />
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
