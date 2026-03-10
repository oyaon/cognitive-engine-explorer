"use client";

import { Card } from "./ui/Card";

const PIPELINE_NODES = [
    { label: 'Input', accent: false },
    { label: 'Policy', accent: false },
    { label: 'Constraint', accent: false },
    { label: 'Result', accent: true },
];

export const DecisionFlow = () => {
    return (
        <Card className="border-slate-800 bg-slate-900">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Decision Pipeline</h4>

            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                {PIPELINE_NODES.map((node, i) => (
                    <div key={node.label} className="flex flex-col md:flex-row items-center gap-2 flex-1 w-full">
                        <div className={`flex-1 w-full rounded-lg border p-3 text-center transition-colors ${node.accent
                            ? 'bg-indigo-500/10 border-indigo-500/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}>
                            <span className={`text-[10px] font-mono font-bold block uppercase tracking-wider ${node.accent ? 'text-indigo-400' : 'text-slate-200'}`}>
                                {node.label}
                            </span>
                        </div>
                        {i < PIPELINE_NODES.length - 1 && (
                            <>
                                <span className="hidden md:block text-slate-400 text-sm">→</span>
                                <span className="md:hidden text-slate-400 text-sm rotate-90">→</span>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};
