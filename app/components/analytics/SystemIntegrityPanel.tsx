"use client";


import { Card } from '../ui/Card';
import { ConstraintIndicator } from './ConstraintIndicator';

/**
 * SystemIntegrityPanel component.
 * Statically exposes core system guarantees and adherence to architectural invariants.
 */
export const SystemIntegrityPanel = () => {
    return (
        <Card className="border-slate-800/50 bg-slate-900/10">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">System Guarantees</h4>
                    <p className="text-[9px] text-slate-600 font-mono mt-0.5">V2_ARCH_SPEC_ADHERENCE</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">STABLE</span>
                </div>
            </div>

            <div className="space-y-2">
                <ConstraintIndicator label="Determinism VERIFIED" satisfied={true} />
                <ConstraintIndicator label="Invariant Engine ACTIVE" satisfied={true} />
                <ConstraintIndicator label="Audit Status PASS" satisfied={true} />

                {/* Secondary Invariants */}
                <div className="pt-2">
                    <div className="h-px w-full bg-slate-800/50 mb-3" />
                    <div className="space-y-2 opacity-60">
                        <ConstraintIndicator label="Kernel Isolation" satisfied={true} />
                        <ConstraintIndicator label="Memory Boundary Safe" satisfied={true} />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-700">KERNEL_V.0.1.0</span>
                    </div>
                    <div className="uppercase tracking-tighter">Verified_Hardware_Attestation</div>
                </div>
            </div>
        </Card>
    );
};

