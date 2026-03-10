"use client";


import { useMemo, memo } from 'react';
import { Card } from '../ui/Card';

// Local Interface Redefinitions (Architectural Isolation)
type PolicyStrategy = "threshold" | "costAware" | "retrievalWeighted";

interface ComparisonResult {
    strategy: PolicyStrategy;
    policyDecision: string;
    projectedCost: number;
    tokenEstimate: number;
    constraintState?: string;
    resolvedModel?: string;
}

interface PolicyComparisonTableProps {
    comparisonResults: ComparisonResult[];
}

const STRATEGY_ORDER: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];

const getStatusColor = (state: string | undefined) => {
    switch (state) {
        case 'compliant': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        case 'degraded': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        case 'breached': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
        default: return 'text-slate-400 bg-slate-900/10 border-slate-800/20';
    }
};

const formatStrategy = (s: string) => {
    return s
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
};

/**
 * PolicyComparisonTable component.
 * Renders a comparison matrix across different policy strategies.
 */
export const PolicyComparisonTable = memo(({ comparisonResults }: PolicyComparisonTableProps) => {
    // Ensure stable ordering of strategies based on the predefined domain order
    const sortedResults = useMemo(() => {
        return [...comparisonResults].sort((a, b) => {
            const indexA = STRATEGY_ORDER.indexOf(a.strategy);
            const indexB = STRATEGY_ORDER.indexOf(b.strategy);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });
    }, [comparisonResults]);

    return (
        <Card className="p-0 overflow-hidden border-slate-800/50">
            <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]" title="Matrix comparing outcomes across diverse arbitration strategies.">Strategy Comparison Matrix</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50">
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50">Strategy</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50">Resolved Model</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 text-right">Tokens</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 text-right">Projected Cost</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 text-center">Constraint State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        {sortedResults.map((result) => (
                            <tr key={result.strategy} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                                        {formatStrategy(result.strategy)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-slate-800 bg-slate-900/50">
                                        <div className={`w-1 h-3 rounded-full ${result.resolvedModel === 'balanced' ? 'bg-indigo-500' : 'bg-sky-400'}`} />
                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                                            {result.resolvedModel}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-xs font-mono tabular-nums text-slate-400">
                                        {result.tokenEstimate.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-xs font-mono tabular-nums text-indigo-400 font-medium">
                                        ${result.projectedCost.toFixed(6)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(result.constraintState)} uppercase tracking-[0.1em]`}>
                                            {result.constraintState || 'unknown'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortedResults.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">
                    <p>No execution data yet.</p>
                    <p>Run a simulation to generate results.</p>
                </div>
            )}
        </Card>
    );
});

