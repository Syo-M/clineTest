'use client';

import { useState } from 'react';
import { useTimer } from './lib/useTimer';
import { useTodos } from './lib/useTodos';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import PomodoroProgress from './components/PomodoroProgress';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';

const TODAY_GOAL = 8;

export default function Home() {
    const { timer, stats, start, pause, reset, skip, selectTodo, formatTime, getProgress, getPhaseLabel } = useTimer();

    const { todos, addTodo, toggleTodo, deleteTodo, completedCount } = useTodos();
    const [showCompleted, setShowCompleted] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="mx-auto max-w-2xl px-4 py-8">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Pomodoro × Todo</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">作業効率化アプリ</p>
                </header>

                <div className="flex flex-col gap-8">
                    {/* Timer Section */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center gap-6">
                        <TimerDisplay
                            timeLeft={timer.timeLeft}
                            isRunning={timer.isRunning}
                            phase={timer.phase}
                            progress={getProgress()}
                            formatTime={formatTime}
                            getPhaseLabel={getPhaseLabel}
                        />

                        <TimerControls
                            isRunning={timer.isRunning}
                            phase={timer.phase}
                            onStart={start}
                            onPause={pause}
                            onReset={reset}
                            onSkip={skip}
                            onTodoSelect={selectTodo}
                            todos={todos}
                            selectedTodoId={timer.selectedTodoId}
                        />

                        <PomodoroProgress
                            todayCount={stats.todayCount}
                            todayGoal={TODAY_GOAL}
                            weekCount={stats.weekCount}
                        />
                    </section>

                    {/* Todo Section */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">タスク一覧</h2>

                        <TodoInput onAdd={addTodo} />

                        <div className="mt-4">
                            <TodoList
                                todos={todos}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                showCompleted={showCompleted}
                                onToggleShowCompleted={() => setShowCompleted(!showCompleted)}
                            />
                        </div>

                        {completedCount > 0 && (
                            <p className="text-sm text-gray-400 text-right mt-2">完了: {completedCount}件</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
