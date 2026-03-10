"use client";

interface MessageInputProps {
    value: string;
    onChange: (val: string) => void;
    onRun: () => void;
    disabled?: boolean;
}

export const MessageInput = ({ value, onChange, onRun, disabled }: MessageInputProps) => {
    return (
        <div className="relative group">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                onKeyDown={(e) => e.key === 'Enter' && onRun()}
                placeholder="Input cognitive command..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 hover:border-slate-700 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono tracking-widest uppercase pointer-events-none">
                {disabled ? 'WAIT' : 'ENTER'}
            </div>
        </div>
    );
};
