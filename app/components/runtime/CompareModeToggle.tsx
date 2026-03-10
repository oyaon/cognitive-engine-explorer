"use client";

interface CompareModeToggleProps {
    active: boolean;
    onToggle: (val: boolean) => void;
}

export const CompareModeToggle = ({ active, onToggle }: CompareModeToggleProps) => {
    return (
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
                onClick={() => onToggle(false)}
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-wider rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500 ${!active
                    ? 'bg-slate-800 text-slate-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
            >
                SINGLE
            </button>
            <button
                onClick={() => onToggle(true)}
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-wider rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500 ${active
                    ? 'bg-slate-800 text-slate-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
            >
                COMPARE
            </button>
        </div>
    );
};
