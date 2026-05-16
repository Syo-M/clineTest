import { useState, useEffect, useCallback } from 'react';
import { Todo } from './types';

const STORAGE_KEY = 'pomodoro-todos';

function loadInitialTodos(): Todo[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load todos:', e);
    }
    return [];
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(loadInitialTodos);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (e) {
            console.error('Failed to save todos:', e);
        }
    }, [todos]);

    const addTodo = useCallback((text: string) => {
        if (!text.trim()) return;
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now(),
        };
        setTodos((prev) => [...prev, newTodo]);
    }, []);

    const toggleTodo = useCallback((id: string) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }, []);

    const deleteTodo = useCallback((id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const completedCount = todos.filter((t) => t.completed).length;

    return { todos, addTodo, toggleTodo, deleteTodo, completedCount };
}
