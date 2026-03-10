"use client";


import { memo } from 'react';
import { Card } from '../ui/Card';

interface ExecutionHistoryProps {
    history: {
        id: number;
        model: string;
        cost: number;
        tokens: number;
        strategy: string;
        timestamp: string;
    }[];
}

/**
 * ExecutionHistory component.
 * Displays a scrollable timeline of system runs with key performance indicators.
 */
export const ExecutionHistory = memo(({ history }: ExecutionHistoryProps) => {
    return (
        <Card className="p-0 border-slate-800/50 bg-slate-900/20 flex flex-col h-[400px]">
            <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/40 sticky top-0 z-10">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Sequence Timeline</span>
                    <span>{history.length} / 50</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {history.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-[10px] text-slate-600 italic uppercase tracking-widest">No history recorded.</p>
                    </div>
                ) : (
                    history.map((entry) => (
                        <div key={entry.id} className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-500">#{entry.id.toString().padStart(3, '0')}</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${entry.model === 'balanced' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-sky-400/10 text-sky-400 border border-sky-400/20'
                                        }`}>
                                        {entry.model}
                                    </span>
                                </div>
                                <span className="text-[9px] font-mono text-slate-600">{entry.timestamp}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/50">
                                <div>
                                    <div className="text-[8px] text-slate-600 uppercase font-mono tracking-tighter">Cost</div>
                                    <div className="text-[10px] text-indigo-400 font-mono">${entry.cost.toFixed(6)}</div>
                                </div>
                                <div>
                                    <div className="text-[8px] text-slate-600 uppercase font-mono tracking-tighter">Tokens</div>
                                    <div className="text-[10px] text-slate-300 font-mono">{entry.tokens}</div>
                                </div>
                                <div>
                                    <div className="text-[8px] text-slate-600 uppercase font-mono tracking-tighter">Policy</div>
                                    <div className="text-[10px] text-slate-500 font-mono truncate uppercase">{entry.strategy}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
});

