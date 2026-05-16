interface TodoListProps {
    todos: Array<{ id: string; text: string; completed: boolean }>;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    showCompleted: boolean;
    onToggleShowCompleted: () => void;
}

export default function TodoList({ todos, onToggle, onDelete, showCompleted, onToggleShowCompleted }: TodoListProps) {
    const filtered = showCompleted ? todos : todos.filter((t) => !t.completed);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">タスク {todos.filter((t) => !t.completed).length}件</span>
                <button onClick={onToggleShowCompleted} className="text-sm text-blue-500 hover:text-blue-600">
                    {showCompleted ? '未完了のみ表示' : '完了済みも表示'}
                </button>
            </div>
            <ul className="flex flex-col gap-2">
                {filtered.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => onToggle(todo.id)}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className={`text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                                {todo.text}
                            </span>
                        </label>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
            {filtered.length === 0 && <p className="text-center text-gray-400 py-4">タスクがありません</p>}
        </div>
    );
}
