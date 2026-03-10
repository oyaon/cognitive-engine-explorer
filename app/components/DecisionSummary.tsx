"use client";

interface DecisionSummaryProps {
    data?: {
        resolvedModel: string;
        policyDecision: string;
        projectedCost: number;
        tokenEstimate: number;
        constraintState: string;
        retrievalUsed: boolean;
    };
}

export const DecisionSummary = ({ data }: DecisionSummaryProps) => {
    if (!data) return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-sm space-y-1">
            <p>No execution data yet.</p>
            <p>Run a simulation to generate results.</p>
        </div>
    );

    const fields = [
        { label: 'Model', value: data.resolvedModel, className: 'text-indigo-400 font-bold' },
        { label: 'Strategy', value: data.policyDecision, className: 'text-slate-200' },
        { label: 'Tokens', value: String(data.tokenEstimate), className: 'text-slate-200' },
        { label: 'Cost', value: `$${data.projectedCost.toFixed(6)}`, className: 'text-emerald-400' },
        {
            label: 'Constraint',
            value: data.constraintState,
            className: (data.constraintState === 'compliant' || data.constraintState === 'SATISFIED')
                ? 'text-emerald-500 font-bold'
                : 'text-amber-500 font-bold'
        },
        { label: 'Retrieval', value: data.retrievalUsed ? 'ENABLED' : 'DISABLED', className: 'text-slate-400' },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 pb-3 border-b border-slate-800">
                Execution Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono tabular-nums">
                {fields.map(({ label, value, className }) => (
                    <div key={label} className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{label}</span>
                        <span className={`mt-0.5 ${className}`}>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
