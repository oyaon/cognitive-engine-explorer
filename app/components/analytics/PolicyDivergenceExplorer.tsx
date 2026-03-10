"use client";

import { useMemo } from "react";
import { Card } from "../ui/Card";

/**
 * Detailed representation of divergence between policy strategies.
 * Provides a granular, point-by-point view of cognitive decision variations across the complexity spectrum.
 */

interface PolicyDivergenceExplorerProps {
    data?: {
        regions: Array<{
            strategy: string;
            range: [number, number];
            decision: string;
        }>;
    };
}

const STRATEGIES = ["threshold", "costAware", "retrievalWeighted"];

export const PolicyDivergenceExplorer = ({ data }: PolicyDivergenceExplorerProps) => {
    // Generate point-by-point comparison data
    const points = useMemo(() => {
        if (!data?.regions) return [];

        const result = [];
        // Sample at 0.1 intervals for precise divergence detection
        for (let c = 0; c <= 1.0; c += 0.1) {
            const complexity = Number(c.toFixed(1));
            const point: any = { complexity, decisions: {}, hasDivergence: false };

            STRATEGIES.forEach(strategy => {
                const region = data.regions.find(r =>
                    r.strategy === strategy &&
                    complexity >= r.range[0] &&
                    complexity <= r.range[1]
                );
                point.decisions[strategy] = region?.decision || "unknown";
            });

            // Check if all decisions are identical for this complexity point
            const firstDecision = point.decisions[STRATEGIES[0]];
            point.hasDivergence = STRATEGIES.some(s => point.decisions[s] !== firstDecision);

            result.push(point);
        }
        return result;
    }, [data]);

    if (!data) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 border-slate-800 bg-slate-950/20">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Divergence Engine Standby</span>
                <p className="text-[10px] text-slate-700 italic">Historical data required for divergence analysis.</p>
            </Card>
        );
    }

    return (
        <Card className="p-0 overflow-hidden border-slate-800/50">
            <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Strategy Divergence Mapping</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50">
                            <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50">Complexity</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50">Threshold</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50">Cost Aware</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50">Retrieval</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/20">
                        {points.map((p, idx) => (
                            <tr
                                key={idx}
                                className={`group transition-colors ${p.hasDivergence ? 'bg-amber-500/[0.03] border-l-2 border-l-amber-500/50' : 'hover:bg-white/[0.01]'}`}
                            >
                                <td className="px-4 py-2 border-r border-slate-800/10">
                                    <span className="text-[10px] font-mono font-bold text-slate-400">{p.complexity.toFixed(1)}</span>
                                </td>
                                {STRATEGIES.map(s => {
                                    const decision = p.decisions[s];
                                    const isBalanced = decision === 'balanced';
                                    return (
                                        <td key={s} className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isBalanced ? 'bg-indigo-500' : 'bg-sky-400'}`} />
                                                <span className={`text-[9px] font-mono uppercase tracking-tighter ${isBalanced ? 'text-indigo-300' : 'text-sky-300'}`}>
                                                    {decision}
                                                </span>
                                            </div>
                                        </td>
                                    );
                                })}
                                <td className="px-4 py-2 text-right">
                                    {p.hasDivergence && (
                                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter animate-pulse">
                                            ⚠ divergence
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-800/30 bg-slate-900/10 flex justify-between items-center text-[9px] font-mono text-slate-600">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    <span className="uppercase tracking-tighter">Divergence Highlighted</span>
                </div>
                <span className="uppercase tracking-tighter italic">V2_Topology_Audit_Pass</span>
            </div>
        </Card>
    );
};
