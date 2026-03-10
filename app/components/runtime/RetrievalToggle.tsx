"use client";

interface RetrievalToggleProps {
    enabled: boolean;
    onToggle: (val: boolean) => void;
    disabled?: boolean;
}

export const RetrievalToggle = ({ enabled, onToggle, disabled }: RetrievalToggleProps) => {
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retrieval Engine</span>
                <span className="text-[11px] text-slate-400">Vector Search {enabled ? 'Active' : 'Bypassed'}</span>
            </div>
            <button
                disabled={disabled}
                onClick={() => onToggle(!enabled)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-900 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${enabled ? 'bg-indigo-500' : 'bg-slate-800'}`}
            >
                <div
                    className={`absolute top-1 left-1 w-3 h-3 bg-slate-200 rounded-full transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
};
