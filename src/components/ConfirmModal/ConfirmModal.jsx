import "./ConfirmModal.scss";

export default function ConfirmModal({ onCancel, onConfirm }) {
    return (
        <div className="modal-backdrop">
            <div className="todo-modal">
                <h1>Diqqat!</h1>
                <p>Bu tugmani bosangiz arxivdagi barcha ma'lumotlar o'chib ketadi, shu tugmani bosishga rozimisiz...</p>
                <div className="todo-footer">
                    <button className="cancel-btn" onClick={onCancel}>
                        Bekor qilish
                    </button>
                    <button className="ok-btn" onClick={onConfirm}>
                        Tasdiqlash
                    </button>
                </div>
            </div>
        </div>
    );
}
