"use client";


import { Card } from '../ui/Card';

export const ArchitectureStack = () => {
    return (
        <Card className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-100 italic">Architecture Stack</h3>
            <div className="space-y-3">
                {['Interface Layer', 'Orchestration Layer', 'Domain Engine', 'System Kernel'].map((layer, i) => (
                    <div
                        key={layer}
                        className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between"
                        style={{ opacity: 1 - i * 0.15 }}
                    >
                        <span className="text-sm font-mono text-slate-400">0{i + 1}</span>
                        <span className="text-sm font-medium text-slate-200">{layer}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
