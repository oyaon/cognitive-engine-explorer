"use client";


import { Card } from '../ui/Card';

interface ExecutionMetadataProps {
    data?: {
        policyDecision: string;
        resolvedModel: string;
        projectedCost: number;
        tokenEstimate: number;
        constraintState: string;
    };
}

export const ExecutionMetadata = ({ data }: ExecutionMetadataProps) => {
    if (!data) {
        return (
            <Card>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Metadata Context</h4>
                <p className="text-[10px] text-slate-600 italic">No execution data available.</p>
            </Card>
        );
    }

    return (
        <Card>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Metadata Context</h4>
            <dl className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                    <dt className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">Policy Decision</dt>
                    <dd className="text-xs text-slate-200 mt-0.5 font-medium">{data.policyDecision}</dd>
                </div>
                <div>
                    <dt className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">Resolved Model</dt>
                    <dd className="text-xs text-slate-200 mt-0.5 font-mono">{data.resolvedModel}</dd>
                </div>
                <div>
                    <dt className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">Projected Cost</dt>
                    <dd className="text-xs text-indigo-400 mt-0.5 font-mono">${data.projectedCost.toFixed(6)}</dd>
                </div>
                <div>
                    <dt className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">Token Estimate</dt>
                    <dd className="text-xs text-slate-200 mt-0.5 font-mono">{data.tokenEstimate}</dd>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800">
                    <dt className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">Constraint State</dt>
                    <dd className={`text-xs mt-0.5 font-bold ${data.constraintState === 'SATISFIED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {data.constraintState}
                    </dd>
                </div>
            </dl>
        </Card>
    );
};
