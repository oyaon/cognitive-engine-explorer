"use client";



// Local Interface Redefinitions (Architectural Isolation)
interface ExecutionMetadata {
    budgetLimit?: number;
    projectedCost: number;
    budgetStress?: number;
    constraintState?: string;
}

interface ConstraintIndicatorProps {
    label?: string;
    satisfied?: boolean;
    metadata?: ExecutionMetadata;
}

/**
 * ConstraintIndicator component.
 * Dual-mode: Renders a simple status pill by default, or a full budget pressure 
 * visualization if metadata is provided.
 */
export const ConstraintIndicator = ({ label, satisfied, metadata }: ConstraintIndicatorProps) => {
    // High-fidelity budget pressure visualization (API Metadata Driven)
    if (metadata) {
        const { budgetLimit, projectedCost, budgetStress, constraintState } = metadata;
        const stress = budgetStress || 0;
        const percentage = Math.min(stress * 100, 100);

        const isExceeded = constraintState === 'breached';
        const isDegraded = constraintState === 'degraded';
        const isCompliant = constraintState === 'compliant';

        let statusColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        let barColor = "bg-indigo-500";
        let shadowColor = "shadow-[0_0_12px_rgba(99,102,241,0.4)]";

        if (isExceeded) {
            statusColor = "text-rose-400 bg-rose-400/10 border-rose-400/20";
            barColor = "bg-rose-500";
            shadowColor = "shadow-[0_0_12px_rgba(244,63,94,0.4)]";
        } else if (isDegraded) {
            statusColor = "text-amber-400 bg-amber-400/10 border-amber-400/20";
            barColor = "bg-amber-500";
            shadowColor = "shadow-[0_0_12px_rgba(245,158,11,0.4)]";
        } else if (stress > 0.8) {
            statusColor = "text-amber-300 bg-amber-300/10 border-amber-300/20";
            barColor = "bg-amber-400";
        }

        return (
            <div className="flex flex-col gap-4 p-5 rounded-xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col" title="Ensures execution stays within token budget.">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-0.5">Constraint Engine</span>
                        <span className="text-xs font-semibold text-slate-400">Budget Pressure Analysis</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${statusColor}`}>
                        {constraintState || 'Compliant'}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end px-0.5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase">Load_Coefficient</span>
                        <span className={`text-xs font-mono tabular-nums font-bold ${isExceeded ? 'text-rose-400' : 'text-slate-200'}`}>
                            {budgetLimit !== undefined ? `${(stress * 100).toFixed(1)}%` : '0.0%'}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
                        <div
                            className={`h-full rounded-full ${barColor} ${shadowColor} transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)`}
                            style={{ width: budgetLimit !== undefined ? `${percentage}%` : '0%' }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-1">
                    <div className="flex flex-col gap-1 border-l border-slate-800 pl-3">
                        <span className="text-[9px] text-slate-400 uppercase font-mono tracking-tighter">Projected_Cost</span>
                        <span className="text-xs text-slate-400 font-mono tabular-nums font-medium">${projectedCost.toFixed(6)}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-slate-800 pl-3">
                        <span className="text-[9px] text-slate-400 uppercase font-mono tracking-tighter">Budget_Ceiling</span>
                        <span className="text-xs text-slate-400 font-mono tabular-nums">
                            {budgetLimit !== undefined ? `$${budgetLimit.toFixed(6)}` : 'UNSET'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Default: Standard status indicator
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/20 group hover:border-slate-800/50 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight group-hover:text-slate-400 transition-colors">{label}</span>
            <div className={`w-2 h-2 rounded-full ${satisfied ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]'} transition-shadow`} />
        </div>
    );
};

