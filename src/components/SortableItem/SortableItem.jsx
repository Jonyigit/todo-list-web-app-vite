import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import crosIcon from "../../assets/icon/cros.svg";
import "./SortableItem.scss";

export default function SortableItem({ id, label, isChecked, changeCheck, deleteTodo }) {
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
