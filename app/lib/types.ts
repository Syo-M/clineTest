export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export type TimerPhase = 'work' | 'break';

export interface TimerState {
    timeLeft: number;
    isRunning: boolean;
    phase: TimerPhase;
    completedPomodoros: number;
    selectedTodoId: string | null;
}

export interface PomodoroStats {
    todayCount: number;
    todayDate: string;
    weekCount: number;
}
