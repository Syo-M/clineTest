import { TimerPhase } from '../lib/types';
import type { Todo } from '../lib/types';

interface TimerControlsProps {
    isRunning: boolean;
    phase: TimerPhase;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onSkip: () => void;
    onTodoSelect: (todoId: string | null) => void;
    todos: Array<{ id: string; text: string; completed: boolean }>;
    selectedTodoId: string | null;
}

export default function TimerControls({
    isRunning,
    phase,
    onStart,
    onPause,
    onReset,
    onSkip,
    onTodoSelect,
    todos,
    selectedTodoId,
}: TimerControlsProps) {
    const selectedTodo = todos.find((t) => t.id === selectedTodoId);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Selected task display */}
            {selectedTodo && (
                <div className="text-center">
                    <span className="text-sm text-gray-500">現在のタスク</span>
                    <p className="font-medium text-gray-800">{selectedTodo.text}</p>
                </div>
            )}

            {/* Todo selector */}
            <select
                value={selectedTodoId || ''}
                onChange={(e) => onTodoSelect(e.target.value || null)}
                disabled={isRunning}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="">タスクを選択...（任意）</option>
                {todos
                    .filter((t) => !t.completed)
                    .map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.text}
                        </option>
                    ))}
            </select>

            {/* Control buttons */}
            <div className="flex gap-3">
                {!isRunning ? (
                    <button
                        onClick={onStart}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        開始
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                        一時停止
                    </button>
                )}
                <button
                    onClick={onReset}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    リセット
                </button>
                <button
                    onClick={onSkip}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    スキップ
                </button>
            </div>
        </div>
    );
}
