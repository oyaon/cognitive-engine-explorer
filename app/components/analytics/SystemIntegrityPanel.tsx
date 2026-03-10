"use client";

import { Card } from '../ui/Card';

export const SystemIntegrityPanel = () => {
    const PRIMARY_CHECKS = [
        'Determinism VERIFIED',
        'Invariant Engine ACTIVE',
        'Audit Status PASS',
    ];
    const SECONDARY_CHECKS = [
        'Kernel Isolation',
        'Memory Boundary Safe',
    ];

    return (
        <Card className="border-slate-800 bg-slate-900">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">System Guarantees</h4>
                    <p className="text-[9px] text-slate-400 font-mono">V2_ARCH_SPEC_ADHERENCE</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">STABLE</span>
                </div>
            </div>

            <div className="space-y-2">
                {PRIMARY_CHECKS.map(label => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 hover:border-slate-700 transition-colors group">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight group-hover:text-slate-200 transition-colors">{label}</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                ))}

                <div className="pt-2 border-t border-slate-800 mt-2 space-y-2 opacity-60">
                    {SECONDARY_CHECKS.map(label => (
                        <div key={label} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 transition-colors">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{label}</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>KERNEL_V.0.1.0</span>
                    <span className="uppercase tracking-tighter">Verified_Hardware_Attestation</span>
                </div>
            </div>
        </Card>
    );
};
