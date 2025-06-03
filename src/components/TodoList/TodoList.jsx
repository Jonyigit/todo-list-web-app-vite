import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { useEffect, useState } from "react";
import crosIcon from "../../assets/icon/cros.svg";
import deleteIcon from "../../assets/icon/delete.svg";
import emptyImg from "../../assets/images/detective.png";
import TodoFooter from "../TodoFooter/TodoFooter";
import "./TodoList.scss";

function SortableItem({ id, label, isChecked, changeCheck, deleteTodo }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <li
            className={clsx("list", { dragging: isDragging })}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <input type="checkbox" checked={isChecked} onChange={() => changeCheck(id)} />
            <span className="text" title={label}>
                {label}
            </span>
            <img src={crosIcon} alt="delete" onClick={() => deleteTodo(id)} />
        </li>
    );
}

export default function TodoList({ todo, setTodo, filter, setFilter }) {
    const [archive, setArchive] = useState(() => {
        const storedArchive = localStorage.getItem("archive");
        return storedArchive ? JSON.parse(storedArchive) : [];
    });

    const [state, setState] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const clearArchive = () => {
        setArchive([]);
        localStorage.removeItem("archive");
        setShowModal(false);
        setState(false);
    };

    const handleClearClick = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const filteredTodos = todo.filter((item) => {
        if (filter === "active") return !item.isChecked;
        if (filter === "complated") return item.isChecked;
        return true;
    });

    const changeCheck = (id) => {
        const updated = todo.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item));
        setTodo(updated);
    };

    const deleteTodo = (id) => {
        const deletedItem = todo.find((item) => item.id === id);
        const updatedTodos = todo.filter((item) => item.id !== id);
        setTodo(updatedTodos);
        if (deletedItem) {
            setArchive((prev) => [...prev, deletedItem]);
        }
    };

    useEffect(() => {
        localStorage.setItem("archive", JSON.stringify(archive));
    }, [archive]);

    const activeArchived = archive.filter((item) => !item.isChecked);
    const completedArchived = archive.filter((item) => item.isChecked);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            const oldIndex = todo.findIndex((item) => item.id === active.id);
            const newIndex = todo.findIndex((item) => item.id === over.id);
            const newOrder = arrayMove(todo, oldIndex, newIndex);
            setTodo(newOrder);
        }
    };

    const activeItem = activeId ? todo.find((item) => item.id === activeId) : null;

    return (
        <section className="todo-lists">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={filteredTodos.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    <ul className="todo-list">
                        {filteredTodos.length === 0 ? (
                            <div className="empty">
                                <img src={emptyImg} alt="empty" />
                                <p className="empty-text">Empty...</p>
                            </div>
                        ) : (
                            filteredTodos.map((item) => (
                                <SortableItem
                                    key={item.id}
                                    id={item.id}
                                    label={item.label}
                                    isChecked={item.isChecked}
                                    changeCheck={changeCheck}
                                    deleteTodo={deleteTodo}
                                />
                            ))
                        )}
                    </ul>
                </SortableContext>

                <DragOverlay>
                    {activeItem ? (
                        <li className="list dragging-overlay">
                            <input type="checkbox" checked={activeItem.isChecked} readOnly />
                            <span className="text" title={activeItem.label}>
                                {activeItem.label}
                            </span>
                            <img src={crosIcon} alt="delete" />
                        </li>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TodoFooter todo={todo} setTodo={setTodo} setFilter={setFilter} />

            <div className="archive">
                <button className="archive-btn" onClick={() => setState(!state)}>
                    <img src={deleteIcon} alt="toggle" />
                </button>
                <div className={clsx("archive-lists", { active: state })}>
                    <div className="archived-section">
                        <h4>Active</h4>
                        {activeArchived.length === 0 ? (
                            <div className="empty">
                                <img src={emptyImg} alt="empty" />
                                <p className="empty-text">Empty...</p>
                            </div>
                        ) : (
                            <ul className="archive-list">
                                {activeArchived.map(({ id, label }) => (
                                    <li key={id}>
                                        <input type="checkbox" checked={false} disabled />
                                        <span title={label}>
                                            {label.length > 15 ? label.slice(0, 15) + "..." : label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="archived-section">
                        <h4>Completed</h4>
                        {completedArchived.length === 0 ? (
                            <div className="empty">
                                <img src={emptyImg} alt="empty" />
                                <p className="empty-text">Empty...</p>
                            </div>
                        ) : (
                            <ul className="archive-list">
                                {completedArchived.map(({ id, label }) => (
                                    <li key={id}>
                                        <input type="checkbox" checked={true} disabled />
                                        <span title={label}>
                                            {label.length > 15 ? label.slice(0, 15) + "..." : label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className="clear-btn" onClick={handleClearClick}>
                        <img src={crosIcon} alt="clear" />
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="todo-modal">
                        <h1>Diqqat!</h1>
                        <p>
                            Bu tugmani bosangiz arxivdagi barcha o'chirilgan ma'lumotlar o'chib ketadi, shu tugmani
                            bosishga rozimisiz...
                        </p>
                        <div className="todo-footer">
                            <button className="cancel-btn" onClick={handleCancel}>
                                Bekor qilish
                            </button>
                            <button className="ok-btn" onClick={clearArchive}>
                                Tasdiqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
