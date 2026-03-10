"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { ComplexitySlider } from "./ComplexitySlider";
import { RetrievalToggle } from "./RetrievalToggle";
import { StrategySelector } from "./StrategySelector";

interface SimulationState {
    complexity: number;
    budget: number;
    retrieval: boolean;
    strategy: string;
}

interface SimulationControlsProps {
    onUpdate?: (state: SimulationState) => void;
}

export const SimulationControls = ({ onUpdate }: SimulationControlsProps) => {
    const [complexity, setComplexity] = useState(0.5);
    const [budget, setBudget] = useState(1.0);
    const [retrieval, setRetrieval] = useState(true);
    const [strategy, setStrategy] = useState("threshold");

    const notifyChange = (updates: Partial<SimulationState>) => {
        if (onUpdate) {
            onUpdate({ complexity, budget, retrieval, strategy, ...updates });
        }
    };

    return (
        <Card className="space-y-6 border-slate-800 bg-slate-900">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Simulation Workspace</h4>
                    <span className="text-[9px] text-slate-400 font-mono">V2_PARALLEL_STATE_CONTROL</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-indigo-400">READY</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Complexity */}
                <ComplexitySlider
                    value={complexity}
                    onChange={(val) => { setComplexity(val); notifyChange({ complexity: val }); }}
                />

                {/* Budget */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Allocation</label>
                        <span className="text-lg font-mono tabular-nums text-slate-200">${budget.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0.01"
                        max="5.0"
                        step="0.01"
                        value={budget}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setBudget(val);
                            notifyChange({ budget: val });
                        }}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono uppercase tabular-nums">
                        <span>$0.01</span>
                        <span>$5.00</span>
                    </div>
                </div>

                {/* Strategy & Retrieval */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-0.5" title="Determines arbitration behavior and model resolution.">Strategy Profile</span>
                        <StrategySelector
                            selected={strategy}
                            onSelect={(s) => { setStrategy(s); notifyChange({ strategy: s }); }}
                        />
                    </div>
                    <div className="space-y-2">
                        <RetrievalToggle
                            enabled={retrieval}
                            onToggle={(e) => { setRetrieval(e); notifyChange({ retrieval: e }); }}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
                    <div className="flex gap-4">
                        <span>Latency_Est: 42ms</span>
                        <span>Deterministic: YES</span>
                    </div>
                    <span className="italic">Kernel_V.2.0.4r</span>
                </div>
            </div>
        </Card>
    );
};
