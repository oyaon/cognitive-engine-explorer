"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SimulationStatus component.
 * Displays the current state of the cognitive simulation engine.
 * Provides visual confirmation of active simulation and latest execution metadata.
 */

interface SimulationStatusProps {
    isActive: boolean;
    lastExecutionTime?: string;
    activePolicy?: string;
}

export const SimulationStatus = memo(({ isActive, lastExecutionTime, activePolicy }: SimulationStatusProps) => {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col sm:flex-row items-center gap-4 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            Simulation Mode ACTIVE
                        </span>
                    </div>

                    <div className="h-4 w-px bg-amber-500/20 hidden sm:block" />

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-amber-500/60 uppercase font-mono leading-none mb-1">Last Sync</span>
                            <span className="text-[10px] font-mono text-amber-200">
                                {lastExecutionTime || '--:--:--'}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[8px] text-amber-500/60 uppercase font-mono leading-none mb-1">Active Policy</span>
                            <span className="text-[10px] font-mono text-amber-200 uppercase tracking-tighter">
                                {activePolicy || 'Determining...'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
