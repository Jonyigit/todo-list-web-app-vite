import clsx from "clsx";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { SlReload } from "react-icons/sl";
import emptyImg from "../../assets/images/detective.png";
import cros from "../../assets/icon/cros.svg";
import "./Archive.scss";

export default function ArchiveSection({ state, setState, archive, handleClearClick, setArchive, setTodo }) {
    const activeArchived = archive.filter((item) => !item.isChecked);
    const completedArchived = archive.filter((item) => item.isChecked);

    const deleteArchiveTodo = (id) => {
        const updatedArchive = archive.filter((item) => item.id !== id);
        setArchive(updatedArchive);
    };

    const restoreArchiveTodo = (id) => {
        const itemToRestore = archive.find((item) => item.id === id);
        if (!itemToRestore) return;

        const updatedArchive = archive.filter((item) => item.id !== id);
        setArchive(updatedArchive);

        setTodo((prev) => [...prev, itemToRestore]);
    };

    return (
        <>
            <div className="archive">
                <div className={clsx("archive-lists", { active: state })}>
                    <div className="title">
                        <h1>Archive</h1>
                        <img src={cros} alt="no photo" onClick={() => setState(false)} />
                    </div>

                    <div className="container">
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
                                                {label.length > 25 ? label.slice(0, 25) + "..." : label}
                                            </span>
                                            <div className="icons">
                                                <SlReload
                                                    style={{ cursor: "pointer", color: "#9495a5" }}
                                                    onClick={() => restoreArchiveTodo(id)}
                                                />
                                                <MdDelete
                                                    style={{ cursor: "pointer", color: "#9495a5" }}
                                                    onClick={() => deleteArchiveTodo(id)}
                                                />
                                            </div>
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
                                                {label.length > 25 ? label.slice(0, 25) + "..." : label}
                                            </span>
                                            <div className="icons">
                                                <SlReload
                                                    style={{ cursor: "pointer", color: "#9495a5" }}
                                                    onClick={() => restoreArchiveTodo(id)}
                                                />
                                                <MdDelete
                                                    style={{ cursor: "pointer", color: "#9495a5" }}
                                                    onClick={() => deleteArchiveTodo(id)}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <button className="clear-btn" onClick={handleClearClick}>
                        <MdDelete style={{ fontSize: "20px", color: "#fff" }} />
                    </button>
                </div>
            </div>
            <button className="archive-btn" onClick={() => setState(!state)}>
                <HiMiniArchiveBoxXMark style={{ fontSize: "20px", color: "#fff" }} />
            </button>
        </>
    );
}
