"use client";

import { Card } from '../ui/Card';

export const ArchitectureStack = () => {
    const layers = [
        { label: 'Interface Layer', index: 1 },
        { label: 'Orchestration Layer', index: 2 },
        { label: 'Domain Engine', index: 3 },
        { label: 'System Kernel', index: 4 },
    ];

    return (
        <Card className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Architecture Stack</h3>
            <div className="space-y-2">
                {layers.map(({ label, index }, i) => (
                    <div
                        key={label}
                        className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between hover:bg-slate-800 hover:border-slate-700 transition-colors group"
                        style={{ opacity: 1 - i * 0.12 }}
                    >
                        <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">0{index}</span>
                        <span className="text-sm font-medium text-slate-200">{label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
