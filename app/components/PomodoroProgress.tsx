interface PomodoroProgressProps {
    todayCount: number;
    todayGoal: number;
    weekCount: number;
}

export default function PomodoroProgress({ todayCount, todayGoal, weekCount }: PomodoroProgressProps) {
    const progress = Math.min((todayCount / todayGoal) * 100, 100);

    return (
        <div className="w-full max-w-xs mx-auto">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">今日のポモドーロ</span>
                <span className="text-sm font-medium text-gray-700">
                    {todayCount}/{todayGoal}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-xs text-gray-400 mt-1">今週累計: {weekCount}回</div>
        </div>
    );
}
