"use client";

interface ComplexitySliderProps {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
}

export const ComplexitySlider = ({ value, onChange, disabled }: ComplexitySliderProps) => {
    return (
        <div className={`space-y-4 ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-end">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Complexity Threshold</label>
                <span className="text-lg font-mono tabular-nums text-slate-200">{(value * 100).toFixed(0)}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono uppercase">
                <span>0%</span>
                <span>100%</span>
            </div>
        </div>
    );
};
