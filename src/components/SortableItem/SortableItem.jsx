import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { RiPencilFill } from "react-icons/ri";
import crosIcon from "../../assets/icon/cros.svg";
import "./SortableItem.scss";

export default function SortableItem({ id, label, isChecked, changeCheck, deleteTodo, editTodo }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(label);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSave = () => {
        editTodo(id, editedText.trim());
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setEditedText(label);
            setIsEditing(false);
        }
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
            {isEditing ? (
                <input
                    className="edit-input"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <span className="text" title={label}>
                    {label}
                </span>
            )}
            <RiPencilFill style={{ color: "#494C6B", cursor: "pointer" }} onClick={() => setIsEditing(true)} />
            <img src={crosIcon} alt="delete" onClick={() => deleteTodo(id)} />
        </li>
    );
}
