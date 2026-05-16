import { useState, useEffect, useCallback } from 'react';
import { TimerState, TimerPhase, PomodoroStats } from './types';

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const STORAGE_TIMER_KEY = 'pomodoro-timer';
const STORAGE_STATS_KEY = 'pomodoro-stats';

function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

function getWeekStart(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    return monday.toISOString().split('T')[0];
}

function loadInitialTimer(): TimerState {
    if (typeof window === 'undefined') {
        return {
            timeLeft: WORK_DURATION,
            isRunning: false,
            phase: 'work',
            completedPomodoros: 0,
            selectedTodoId: null,
        };
    }
    try {
        const saved = localStorage.getItem(STORAGE_TIMER_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...parsed };
        }
    } catch (e) {
        console.error('Failed to load timer state:', e);
    }
    return { timeLeft: WORK_DURATION, isRunning: false, phase: 'work', completedPomodoros: 0, selectedTodoId: null };
}

function loadInitialStats(): PomodoroStats {
    if (typeof window === 'undefined') {
        return { todayCount: 0, todayDate: getTodayString(), weekCount: 0 };
    }
    try {
        const saved = localStorage.getItem(STORAGE_STATS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...parsed };
        }
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
    return { todayCount: 0, todayDate: getTodayString(), weekCount: 0 };
}

export function useTimer() {
    const [timer, setTimer] = useState<TimerState>(loadInitialTimer);
    const [stats, setStats] = useState<PomodoroStats>(loadInitialStats);

    // Persist timer state
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_TIMER_KEY, JSON.stringify(timer));
        } catch (e) {
            console.error('Failed to save timer state:', e);
        }
    }, [timer]);

    // Persist stats
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    }, [stats]);

    // Timer countdown
    useEffect(() => {
        if (!timer.isRunning) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev.timeLeft <= 1) {
                    // Timer finished
                    const newPhase: TimerPhase = prev.phase === 'work' ? 'break' : 'work';
                    const newDuration = newPhase === 'work' ? WORK_DURATION : BREAK_DURATION;

                    // Update stats when work session completes
                    let newStats = { ...stats };
                    if (prev.phase === 'work') {
                        const today = getTodayString();
                        if (newStats.todayDate !== today) {
                            newStats = { todayCount: 1, todayDate: today, weekCount: stats.weekCount };
                        } else {
                            newStats = { ...newStats, todayCount: newStats.todayCount + 1 };
                        }
                        const weekStart = getWeekStart();
                        // Simple week tracking - just increment
                        newStats = { ...newStats, weekCount: newStats.weekCount + 1 };
                    }
                    setStats(newStats);

                    return {
                        ...prev,
                        timeLeft: newDuration,
                        isRunning: false,
                        phase: newPhase,
                    };
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer.isRunning, stats]);

    const start = useCallback(() => {
        setTimer((prev) => ({ ...prev, isRunning: true }));
    }, []);

    const pause = useCallback(() => {
        setTimer((prev) => ({ ...prev, isRunning: false }));
    }, []);

    const reset = useCallback(() => {
        const duration = timer.phase === 'work' ? WORK_DURATION : BREAK_DURATION;
        setTimer((prev) => ({ ...prev, timeLeft: duration, isRunning: false }));
    }, [timer.phase]);

    const skip = useCallback(() => {
        const newPhase: TimerPhase = timer.phase === 'work' ? 'break' : 'work';
        const newDuration = newPhase === 'work' ? WORK_DURATION : BREAK_DURATION;
        setTimer((prev) => ({ ...prev, phase: newPhase, timeLeft: newDuration, isRunning: false }));
    }, [timer.phase]);

    const selectTodo = useCallback((todoId: string | null) => {
        setTimer((prev) => ({ ...prev, selectedTodoId: todoId }));
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = (): number => {
        const total = timer.phase === 'work' ? WORK_DURATION : BREAK_DURATION;
        return ((total - timer.timeLeft) / total) * 100;
    };

    const getPhaseLabel = (): string => {
        return timer.phase === 'work' ? '作業中' : '休憩中';
    };

    return {
        timer,
        stats,
        start,
        pause,
        reset,
        skip,
        selectTodo,
        formatTime,
        getProgress,
        getPhaseLabel,
    };
}
