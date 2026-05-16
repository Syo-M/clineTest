import { TimerPhase } from '../lib/types';

interface TimerDisplayProps {
    timeLeft: number;
    isRunning: boolean;
    phase: TimerPhase;
    progress: number;
    formatTime: (seconds: number) => string;
    getPhaseLabel: () => string;
}

export default function TimerDisplay({
    timeLeft,
    isRunning,
    phase,
    progress,
    formatTime,
    getPhaseLabel,
}: TimerDisplayProps) {
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Color based on phase and time remaining
    let ringColor = 'text-blue-500';
    if (phase === 'break') {
        ringColor = 'text-green-500';
    } else if (timeLeft <= 10 && timeLeft > 0) {
        ringColor = 'text-red-500';
    }

    return (
        <div className="flex flex-col items-center">
            {/* SVG circular progress ring */}
            <div className="relative w-72 h-72">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
                    {/* Background ring */}
                    <circle
                        cx="130"
                        cy="130"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                    />
                    {/* Progress ring */}
                    <circle
                        cx="130"
                        cy="130"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className={`${ringColor} transition-colors duration-300`}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                    />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-sm font-medium ${phase === 'break' ? 'text-green-600' : 'text-blue-600'}`}>
                        {getPhaseLabel()}
                    </span>
                    <span className="text-6xl font-bold text-gray-800 tabular-nums">{formatTime(timeLeft)}</span>
                    {isRunning && <span className="text-sm text-gray-500 mt-1">進行中...</span>}
                </div>
            </div>
        </div>
    );
}
