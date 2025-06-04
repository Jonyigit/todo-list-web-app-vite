import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import emptyImg from "../../assets/images/detective.png";
import TodoFooter from "../TodoFooter/TodoFooter";
import SortableItem from "../SortableItem/SortableItem";
import ArchiveSection from "../Archive/Archive";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./TodoList.scss";

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

    const handleClearClick = () => setShowModal(true);
    const handleCancel = () => setShowModal(false);

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
        if (deletedItem) setArchive((prev) => [...prev, deletedItem]);
    };

    useEffect(() => {
        localStorage.setItem("archive", JSON.stringify(archive));
    }, [archive]);

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
            setTodo(arrayMove(todo, oldIndex, newIndex));
        }
    };

    const activeItem = activeId ? todo.find((item) => item.id === activeId) : null;

    return (
        <>
            <section className="todo-lists">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredTodos.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
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
                        {activeItem && (
                            <li className="list dragging-overlay">
                                <input type="checkbox" checked={activeItem.isChecked} readOnly />
                                <span className="text" title={activeItem.label}>
                                    {activeItem.label}
                                </span>
                            </li>
                        )}
                    </DragOverlay>
                </DndContext>

                <TodoFooter todo={todo} setTodo={setTodo} setFilter={setFilter} setArchive={setArchive} />

                {showModal && <ConfirmModal onCancel={handleCancel} onConfirm={clearArchive} />}
            </section>
            <ArchiveSection archive={archive} state={state} setState={setState} handleClearClick={handleClearClick} />
        </>
    );
}
