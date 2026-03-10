"use client";


import { Card } from '../ui/Card';

interface DecisionTraceProps {
    reasoning?: string[];
    finalModel?: string;
}

export const DecisionTrace = ({ reasoning = [], finalModel }: DecisionTraceProps) => {
    return (
        <Card className="border-l-4 border-l-indigo-500">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Decision Trace Log
            </h4>
            <div className="space-y-2 font-mono text-[11px] text-slate-400">
                {reasoning.map((step, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-slate-600">[{i}]</span>
                        <span className="leading-relaxed break-words">{step}</span>
                    </div>
                ))}
                {finalModel && (
                    <div className="mt-4 pt-2 border-t border-slate-800 text-indigo-400 font-bold">
                        Final model selected: {finalModel}
                    </div>
                )}
                {reasoning.length === 0 && !finalModel && (
                    <div className="italic text-slate-600">Awaiting system execution...</div>
                )}
            </div>
        </Card>
    );
};
