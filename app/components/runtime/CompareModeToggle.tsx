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
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-wider rounded-lg transition-all ${!active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-400'
                    }`}
            >
                SINGLE
            </button>
            <button
                onClick={() => onToggle(true)}
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-wider rounded-lg transition-all ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-400'
                    }`}
            >
                COMPARE
            </button>
        </div>
    );
};
