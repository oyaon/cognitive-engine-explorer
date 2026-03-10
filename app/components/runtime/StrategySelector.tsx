"use client";



const strategies = ['threshold', 'costAware', 'retrievalWeighted'];

interface StrategySelectorProps {
    selected: string;
    onSelect: (val: string) => void;
    disabled?: boolean;
}

export const StrategySelector = ({ selected, onSelect, disabled }: StrategySelectorProps) => {
    return (
        <div className={`flex flex-wrap gap-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {strategies.map(s => (
                <button
                    key={s}
                    onClick={() => onSelect(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all border uppercase ${selected === s
                        ? 'bg-white text-black border-white'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                        }`}
                >
                    {s.replace(/([A-Z])/g, ' $1')}
                </button>
            ))}
        </div>
    );
};
