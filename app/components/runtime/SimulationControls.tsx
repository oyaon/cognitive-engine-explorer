"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { ComplexitySlider } from "./ComplexitySlider";
import { RetrievalToggle } from "./RetrievalToggle";
import { StrategySelector } from "./StrategySelector";

/**
 * SimulationControls component.
 * Provides a unified interface for adjusting cognitive simulation parameters.
 * Maintains local state for real-time interaction feedback.
 */

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
    // Parameter States
    const [complexity, setComplexity] = useState(0.5);
    const [budget, setBudget] = useState(1.0);
    const [retrieval, setRetrieval] = useState(true);
    const [strategy, setStrategy] = useState("threshold");

    // Unified state updater to notify parent components
    const notifyChange = (updates: Partial<SimulationState>) => {
        if (onUpdate) {
            onUpdate({
                complexity,
                budget,
                retrieval,
                strategy,
                ...updates
            });
        }
    };

    return (
        <Card className="space-y-6 border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Simulation Workspace</h4>
                    <span className="text-[8px] text-slate-600 font-mono mt-0.5">V2_PARALLEL_STATE_CONTROL</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-indigo-400">READY</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Complexity Threshold Control */}
                <ComplexitySlider
                    value={complexity}
                    onChange={(val) => {
                        setComplexity(val);
                        notifyChange({ complexity: val });
                    }}
                />

                {/* 2. Budgetary Constraint Simulation */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Allocation ($)</label>
                        <span className="text-lg font-mono text-white tabular-nums">${budget.toFixed(2)}</span>
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
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                    />
                    <div className="flex justify-between text-[8px] text-slate-600 font-mono uppercase">
                        <span>Min: 0.01</span>
                        <span>Max: 5.00</span>
                    </div>
                </div>

                {/* 3. Logic & Retrieval Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Strategy Profile</span>
                        <StrategySelector
                            selected={strategy}
                            onSelect={(s) => {
                                setStrategy(s);
                                notifyChange({ strategy: s });
                            }}
                        />
                    </div>
                    <div className="space-y-3">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Kernel Options</span>
                        <RetrievalToggle
                            enabled={retrieval}
                            onToggle={(e) => {
                                setRetrieval(e);
                                notifyChange({ retrieval: e });
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
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
