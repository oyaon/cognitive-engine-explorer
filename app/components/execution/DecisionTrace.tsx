"use client";

import { Card } from '../ui/Card';

interface DecisionTraceProps {
    reasoning?: string[];
    finalModel?: string;
}

export const DecisionTrace = ({ reasoning = [], finalModel }: DecisionTraceProps) => {
    const isEmpty = reasoning.length === 0 && !finalModel;

    return (
        <Card className="border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">Decision Trace Log</h4>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-slate-400 h-48 overflow-y-auto custom-scrollbar pr-1">
                {isEmpty ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-sm space-y-1">
                        <p>No execution data yet. Run a simulation.</p>
                    </div>
                ) : (
                    <>
                        {reasoning.map((step, i) => (
                            <div key={i} className="flex gap-2 leading-relaxed">
                                <span className="text-slate-400 shrink-0">[{i}]</span>
                                <span className="break-words">{step}</span>
                            </div>
                        ))}
                        {finalModel && (
                            <div className="mt-4 pt-2 border-t border-slate-800 text-indigo-400 font-bold">
                                Final model selected: {finalModel}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
};
